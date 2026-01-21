import mongoose from "mongoose";
import Products from "@app/models/products.model";
import { withCache } from "@app/core/cache";
import { SearchService } from "@app/services/searchService";

type SearchBody = {
  text: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  sort: Record<string, number> | null;
  limit: number;
  skip: number;
};

type SearchResult = Record<string, unknown>;

const cacheKey = (suffix: string) => `public:products:${suffix}`;

class PublicProductsService {
  private searchService?: SearchService;

  constructor(searchService?: SearchService) {
    this.searchService = searchService;
  }

  async listAllActive() {
    return withCache(cacheKey("all"), undefined, async () => {
      return Products.find({ isActive: true });
    });
  }

  async getBySeo(seo: string) {
    return withCache(cacheKey(`seo:${seo}`), undefined, async () => {
      return Products.aggregate([
        {
          $match: {
            seo,
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "productimages",
            localField: "_id",
            foreignField: "product_id",
            as: "allImages",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories_id",
            foreignField: "_id",
            as: "categories_id",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brands_id",
            foreignField: "_id",
            as: "brands_id",
          },
        },
      ]);
    });
  }

  async listHome(body: { sort: Record<string, number>; limit: number }) {
    const key = cacheKey(
      `home:${Buffer.from(JSON.stringify(body)).toString("base64")}`
    );
    return withCache(key, undefined, async () => {
      const mongoPost = [
        {
          $match: { isActive: true },
        },
        {
          $lookup: {
            from: "productimages",
            localField: "_id",
            foreignField: "product_id",
            as: "allImages",
          },
        },
        { $sort: body.sort },
        { $limit: body.limit },
      ] as unknown as mongoose.PipelineStage[];

      return Products.aggregate(mongoPost);
    });
  }

  private functionReplaceObjectID(key: string, data: string[]) {
    const newData: Record<string, mongoose.Types.ObjectId>[] = [];
    data.forEach((val) => {
      const keyAndData: Record<string, mongoose.Types.ObjectId> = {
        [key]: new mongoose.Types.ObjectId(val),
      };
      newData.push(keyAndData);
    });
    return newData;
  }

  async search(body: SearchBody) {
    const key = cacheKey(
      `search:${Buffer.from(JSON.stringify(body)).toString("base64")}`
    );
    return withCache<SearchResult[]>(key, 30, async () => {
      if (this.searchService?.isEnabled()) {
        const results = await this.searchService.searchProducts(body);
        if (!results.ids.length) {
          return [];
        }
        const objectIds = results.ids.map((id) => new mongoose.Types.ObjectId(id));
        const data = await Products.aggregate([
          {
            $match: {
              _id: { $in: objectIds },
              isActive: true,
            },
          },
          {
            $lookup: {
              from: "productimages",
              localField: "_id",
              foreignField: "product_id",
              as: "allImages",
            },
          },
        ]);

        const dataMap = new Map(data.map((item) => [String(item._id), item]));
        return results.ids
          .map((id) => dataMap.get(String(id)))
          .filter((item): item is SearchResult => Boolean(item));
      }

      const brandsMongo =
        body.brands.length > 0
          ? {
              $or: this.functionReplaceObjectID("brands_id", body.brands),
            }
          : {};

      const skipMongo =
        body.skip !== 0
          ? {
              $skip: body.skip,
            }
          : { $skip: 0 };

      const limitMongo =
        body.limit !== 0
          ? {
              $limit: body.limit,
            }
          : { $limit: 0 };

      const sortMongo =
        typeof body.sort === "object" && body.sort
          ? {
              $sort: body.sort,
            }
          : { $sort: { updatedAt: -1 } };

      const categoriesMongo =
        body.categories.length > 0
          ? {
              $or: this.functionReplaceObjectID("categories_id", body.categories),
            }
          : {};

      const textMongo =
        body.text !== ""
          ? {
              $text: {
                $search: `${body.text}`,
              },
            }
          : {};

      const mongoPost = [
        {
          $match: {
            $and: [
              { isActive: true },
              categoriesMongo,
              brandsMongo,
              textMongo,
              {
                $or: [
                  {
                    price: {
                      $gte:
                        body.minPrice == null || body.minPrice === 0
                          ? 1
                          : body.minPrice,
                      $lte:
                        body.maxPrice == null || body.maxPrice === 0
                          ? 1000000000000000000000000000
                          : body.maxPrice,
                    },
                  },
                  {
                    $and: [
                      { "variant_products.visible": true },
                      {
                        "variant_products.price": {
                          $gte:
                            body.minPrice == null || body.minPrice === 0
                              ? 1
                              : body.minPrice,
                          $lte:
                            body.maxPrice == null || body.maxPrice === 0
                              ? 1000000000000000000000000000
                              : body.maxPrice,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        skipMongo,
        limitMongo,
        sortMongo,
        {
          $lookup: {
            from: "productimages",
            localField: "_id",
            foreignField: "product_id",
            as: "allImages",
          },
        },
      ] as unknown as mongoose.PipelineStage[];

      return Products.aggregate(mongoPost);
    });
  }
}

export { PublicProductsService };
