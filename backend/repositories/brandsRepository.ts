import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Brands, { BrandsDocument } from "@app/models/brands.model";

class BrandsRepository {
  findAll(filter?: FilterQuery<BrandsDocument>, options?: QueryOptions) {
    return Brands.find(filter ?? {}, null, options ?? undefined).sort({
      order: 1,
    });
  }

  findById(id: string, options?: QueryOptions) {
    return Brands.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<BrandsDocument>, options?: QueryOptions) {
    return Brands.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<BrandsDocument>, options?: QueryOptions) {
    return Brands.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<BrandsDocument>,
    options?: QueryOptions
  ) {
    return Brands.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Brands.findByIdAndDelete(id, options);
  }

  count(filter?: FilterQuery<BrandsDocument>) {
    return Brands.countDocuments(filter ?? {});
  }
}

export { BrandsRepository };
