import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Products, { ProductsDocument } from "@app/models/products.model";

class ProductsRepository {
  findAll(filter?: FilterQuery<ProductsDocument>, options?: QueryOptions) {
    return Products.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Products.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<ProductsDocument>, options?: QueryOptions) {
    return Products.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<ProductsDocument>, options?: QueryOptions) {
    return Products.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<ProductsDocument>,
    options?: QueryOptions
  ) {
    return Products.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  updateOne(
    filter: FilterQuery<ProductsDocument>,
    payload: UpdateQuery<ProductsDocument>,
    options?: QueryOptions
  ) {
    return Products.updateOne(filter, payload, options ?? undefined);
  }

  deleteById(id: string, options?: QueryOptions) {
    return Products.findByIdAndDelete(id, options);
  }

  count(filter?: FilterQuery<ProductsDocument>) {
    return Products.countDocuments(filter ?? {});
  }

  aggregateByCategory(options?: QueryOptions) {
    return Products.aggregate([
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

export { ProductsRepository };
