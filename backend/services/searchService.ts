import { Client } from "@elastic/elasticsearch";
import { getElasticClient, getElasticIndexPrefix } from "@app/core/elasticClient";
import Products, { ProductsDocument } from "@app/models/products.model";
import Categories, { CategoriesDocument } from "@app/models/categories.model";
import Brands, { BrandsDocument } from "@app/models/brands.model";

type SearchProductParams = {
  text?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: Record<string, number> | null;
  limit?: number;
  skip?: number;
};

type SearchResult = {
  ids: string[];
  total: number;
};

type ElasticIndexMappings = Record<string, unknown>;

type PriceRange = { min: number; max: number };

class SearchService {
  private client: Client | null;
  private indexPrefix: string;

  constructor(
    client: Client | null = getElasticClient(),
    indexPrefix: string = getElasticIndexPrefix()
  ) {
    this.client = client;
    this.indexPrefix = indexPrefix;
  }

  isEnabled(): boolean {
    return Boolean(this.client);
  }

  indexName(name: string): string {
    return `${this.indexPrefix}_${name}`;
  }

  async ensureIndices(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.ensureIndex(this.indexName("products"), {
      properties: {
        title: { type: "text", fields: { keyword: { type: "keyword" } } },
        description: { type: "text" },
        description_short: { type: "text" },
        seo: { type: "keyword" },
        categories_id: { type: "keyword" },
        brands_id: { type: "keyword" },
        isActive: { type: "boolean" },
        type: { type: "boolean" },
        price: { type: "float" },
        before_price: { type: "float" },
        price_min: { type: "float" },
        price_max: { type: "float" },
        updatedAt: { type: "date" },
      },
    });

    await this.ensureIndex(this.indexName("categories"), {
      properties: {
        title: { type: "text", fields: { keyword: { type: "keyword" } } },
        description: { type: "text" },
        seo: { type: "keyword" },
        isActive: { type: "boolean" },
        order: { type: "integer" },
        updatedAt: { type: "date" },
      },
    });

    await this.ensureIndex(this.indexName("brands"), {
      properties: {
        title: { type: "text", fields: { keyword: { type: "keyword" } } },
        description: { type: "text" },
        seo: { type: "keyword" },
        isActive: { type: "boolean" },
        order: { type: "integer" },
        updatedAt: { type: "date" },
      },
    });
  }

  async reindexAll(): Promise<void> {
    if (!this.client) {
      return;
    }

    const [products, categories, brands] = await Promise.all([
      Products.find().lean(),
      Categories.find().lean(),
      Brands.find().lean(),
    ]);
    const productDocs = products as unknown as ProductsDocument[];
    const categoryDocs = categories as unknown as CategoriesDocument[];
    const brandDocs = brands as unknown as BrandsDocument[];

    await this.bulkIndex<ProductsDocument>(
      this.indexName("products"),
      productDocs,
      (product) => this.buildProductDocument(product)
    );
    await this.bulkIndex<CategoriesDocument>(
      this.indexName("categories"),
      categoryDocs,
      (category) => ({
        title: category.title,
        description: category.description || "",
        seo: category.seo,
        isActive: Boolean(category.isActive),
        order: category.order,
        updatedAt: category.updatedAt,
      })
    );
    await this.bulkIndex<BrandsDocument>(
      this.indexName("brands"),
      brandDocs,
      (brand) => ({
        title: brand.title,
        description: brand.description || "",
        seo: brand.seo,
        isActive: Boolean(brand.isActive),
        order: brand.order,
        updatedAt: brand.updatedAt,
      })
    );
  }

  async bulkIndex<T extends { _id?: unknown }>(
    index: string,
    records: T[],
    buildDocument: (record: T) => Record<string, unknown>
  ): Promise<void> {
    if (!records.length || !this.client) {
      return;
    }
    const body: Array<Record<string, unknown>> = [];
    for (const record of records) {
      if (!record._id) {
        continue;
      }
      body.push({ index: { _index: index, _id: String(record._id) } });
      body.push(buildDocument(record));
    }
    await this.client.bulk({ refresh: true, body });
  }

  async ensureIndex(index: string, mappings: ElasticIndexMappings): Promise<void> {
    if (!this.client) {
      return;
    }
    const exists = await this.client.indices.exists({ index });
    if (exists) {
      return;
    }
    await this.client.indices.create({ index, mappings } as any);
  }

  async indexProduct(product?: ProductsDocument | null): Promise<void> {
    if (!this.client || !product) {
      return;
    }
    const payload = this.buildProductDocument(product);
    await this.client.index({
      index: this.indexName("products"),
      id: String(product._id),
      document: payload,
      refresh: "wait_for",
    });
  }

  async deleteProduct(id?: string): Promise<void> {
    if (!this.client || !id) {
      return;
    }
    try {
      await this.client.delete({
        index: this.indexName("products"),
        id: String(id),
        refresh: "wait_for",
      });
    } catch (error: unknown) {
      const err = error as { meta?: { statusCode?: number } };
      if (err.meta?.statusCode !== 404) {
        throw error;
      }
    }
  }

  async indexCategory(category?: CategoriesDocument | null): Promise<void> {
    if (!this.client || !category) {
      return;
    }
    await this.client.index({
      index: this.indexName("categories"),
      id: String(category._id),
      document: {
        title: category.title,
        description: category.description || "",
        seo: category.seo,
        isActive: Boolean(category.isActive),
        order: category.order,
        updatedAt: category.updatedAt,
      },
      refresh: "wait_for",
    });
  }

  async deleteCategory(id?: string): Promise<void> {
    if (!this.client || !id) {
      return;
    }
    try {
      await this.client.delete({
        index: this.indexName("categories"),
        id: String(id),
        refresh: "wait_for",
      });
    } catch (error: unknown) {
      const err = error as { meta?: { statusCode?: number } };
      if (err.meta?.statusCode !== 404) {
        throw error;
      }
    }
  }

  async indexBrand(brand?: BrandsDocument | null): Promise<void> {
    if (!this.client || !brand) {
      return;
    }
    await this.client.index({
      index: this.indexName("brands"),
      id: String(brand._id),
      document: {
        title: brand.title,
        description: brand.description || "",
        seo: brand.seo,
        isActive: Boolean(brand.isActive),
        order: brand.order,
        updatedAt: brand.updatedAt,
      },
      refresh: "wait_for",
    });
  }

  async deleteBrand(id?: string): Promise<void> {
    if (!this.client || !id) {
      return;
    }
    try {
      await this.client.delete({
        index: this.indexName("brands"),
        id: String(id),
        refresh: "wait_for",
      });
    } catch (error: unknown) {
      const err = error as { meta?: { statusCode?: number } };
      if (err.meta?.statusCode !== 404) {
        throw error;
      }
    }
  }

  async searchProducts(params?: SearchProductParams): Promise<SearchResult> {
    if (!this.client) {
      return { ids: [], total: 0 };
    }
    const {
      text = "",
      categories = [],
      brands = [],
      minPrice = 0,
      maxPrice = 0,
      sort = null,
      limit = 12,
      skip = 0,
    } = params || {};

    const must: Record<string, unknown>[] = [];
    if (text) {
      must.push({
        multi_match: {
          query: text,
          fields: ["title^3", "description", "description_short", "seo"],
        },
      });
    }

    const filter: Record<string, unknown>[] = [{ term: { isActive: true } }];
    if (categories.length) {
      filter.push({ terms: { categories_id: categories } });
    }
    if (brands.length) {
      filter.push({ terms: { brands_id: brands } });
    }
    if (minPrice) {
      filter.push({ range: { price_max: { gte: minPrice } } });
    }
    if (maxPrice) {
      filter.push({ range: { price_min: { lte: maxPrice } } });
    }

    const sortClause = this.resolveProductSort(sort);

    const response = await this.client.search({
      index: this.indexName("products"),
      from: skip,
      size: limit,
      query: must.length
        ? { bool: { must, filter } }
        : { bool: { filter } },
      sort: sortClause as unknown as Array<Record<string, "asc" | "desc">>,
    });

    const hits = response.hits?.hits ?? [];
    const total =
      typeof response.hits?.total === "number"
        ? response.hits.total
        : response.hits?.total?.value ?? 0;
    const ids = hits.map((hit) => String(hit._id));
    return { ids, total };
  }

  async searchCategories(query: string): Promise<string[]> {
    if (!this.client) {
      return [];
    }
    const response = await this.client.search({
      index: this.indexName("categories"),
      size: 50,
      query: query
        ? {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: ["title^2", "description", "seo"],
                  },
                },
              ],
              filter: [{ term: { isActive: true } }],
            },
          }
        : { match_all: {} },
    });
    return response.hits?.hits?.map((hit) => String(hit._id)) ?? [];
  }

  async searchBrands(query: string): Promise<string[]> {
    if (!this.client) {
      return [];
    }
    const response = await this.client.search({
      index: this.indexName("brands"),
      size: 50,
      query: query
        ? {
            bool: {
              must: [
                {
                  multi_match: {
                    query,
                    fields: ["title^2", "description", "seo"],
                  },
                },
              ],
              filter: [{ term: { isActive: true } }],
            },
          }
        : { match_all: {} },
    });
    return response.hits?.hits?.map((hit) => String(hit._id)) ?? [];
  }

  resolveProductSort(
    sort: Record<string, number> | null
  ): Array<Record<string, "asc" | "desc">> {
    if (sort && typeof sort === "object") {
      const direction =
        sort["variant_products.price"] ??
        sort["price"] ??
        sort["price_min"] ??
        sort["price_max"];
      if (direction) {
        const order = direction === -1 ? "desc" : "asc";
        const field = order === "desc" ? "price_max" : "price_min";
        return [{ [field]: order }] as Array<Record<string, "asc" | "desc">>;
      }
    }
    return [{ updatedAt: "desc" }];
  }

  buildProductDocument(product: ProductsDocument) {
    const priceRange = this.resolvePriceRange(product);
    return {
      title: product.title,
      description: product.description || "",
      description_short: product.description_short || "",
      seo: product.seo,
      categories_id: product.categories_id ? String(product.categories_id) : null,
      brands_id: product.brands_id ? String(product.brands_id) : null,
      isActive: Boolean(product.isActive),
      type: Boolean(product.type),
      price: product.price || 0,
      before_price: product.before_price || 0,
      price_min: priceRange.min,
      price_max: priceRange.max,
      updatedAt: product.updatedAt,
    };
  }

  resolvePriceRange(product: ProductsDocument): PriceRange {
    if (Array.isArray(product.variant_products) && product.variant_products.length) {
      const prices = product.variant_products
        .map((item) => (item as { price?: number }).price)
        .filter((price): price is number => typeof price === "number");
      if (prices.length) {
        return { min: Math.min(...prices), max: Math.max(...prices) };
      }
    }
    const price = typeof product.price === "number" ? product.price : 0;
    return { min: price, max: price };
  }
}

export { SearchService };
