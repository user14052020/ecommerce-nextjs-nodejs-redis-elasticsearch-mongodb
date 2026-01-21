import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Categories, { CategoriesDocument } from "@app/models/categories.model";

class CategoriesRepository {
  findAll(filter?: FilterQuery<CategoriesDocument>, options?: QueryOptions) {
    return Categories.find(filter ?? {}, null, options ?? undefined).sort({
      order: 1,
    });
  }

  findById(id: string, options?: QueryOptions) {
    return Categories.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<CategoriesDocument>, options?: QueryOptions) {
    return Categories.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<CategoriesDocument>, options?: QueryOptions) {
    return Categories.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<CategoriesDocument>,
    options?: QueryOptions
  ) {
    return Categories.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Categories.findByIdAndDelete(id, options);
  }

  count(filter?: FilterQuery<CategoriesDocument>) {
    return Categories.countDocuments(filter ?? {});
  }
}

export { CategoriesRepository };
