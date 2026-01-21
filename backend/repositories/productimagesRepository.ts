import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Productimages, {
  ProductimagesDocument,
} from "@app/models/productimages.model";

class ProductimagesRepository {
  findAll(
    filter?: FilterQuery<ProductimagesDocument>,
    options?: QueryOptions
  ) {
    return Productimages.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Productimages.findById(id, null, options ?? undefined);
  }

  findOne(
    filter?: FilterQuery<ProductimagesDocument>,
    options?: QueryOptions
  ) {
    return Productimages.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<ProductimagesDocument>, options?: QueryOptions) {
    return Productimages.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<ProductimagesDocument>,
    options?: QueryOptions
  ) {
    return Productimages.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Productimages.findByIdAndDelete(id, options);
  }

  aggregateByCategory(options?: QueryOptions) {
    return Productimages.aggregate([
      { $unwind: "$category_id" },
      {
        $group: {
          _id: "$category_id.label",
          count: { $sum: 1 },
        },
      },
    ]).option(options ?? {});
  }
}

export { ProductimagesRepository };
