import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Variants, { VariantsDocument } from "@app/models/variants.model";

class VariantsRepository {
  findAll(filter?: FilterQuery<VariantsDocument>, options?: QueryOptions) {
    return Variants.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Variants.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<VariantsDocument>, options?: QueryOptions) {
    return Variants.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<VariantsDocument>, options?: QueryOptions) {
    return Variants.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<VariantsDocument>,
    options?: QueryOptions
  ) {
    return Variants.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Variants.findByIdAndDelete(id, options);
  }
}

export { VariantsRepository };
