import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Homeslider, { HomesliderDocument } from "@app/models/homeslider.model";

class HomesliderRepository {
  findAll(filter?: FilterQuery<HomesliderDocument>, options?: QueryOptions) {
    return Homeslider.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Homeslider.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<HomesliderDocument>, options?: QueryOptions) {
    return Homeslider.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<HomesliderDocument>, options?: QueryOptions) {
    return Homeslider.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<HomesliderDocument>,
    options?: QueryOptions
  ) {
    return Homeslider.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Homeslider.findByIdAndDelete(id, options);
  }
}

export { HomesliderRepository };
