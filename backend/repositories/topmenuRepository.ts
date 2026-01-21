import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Topmenu, { TopmenuDocument } from "@app/models/topmenu.model";

class TopmenuRepository {
  findAll(filter?: FilterQuery<TopmenuDocument>, options?: QueryOptions) {
    return Topmenu.find(filter ?? {}, null, options ?? undefined).sort({
      order: 1,
    });
  }

  findById(id: string, options?: QueryOptions) {
    return Topmenu.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<TopmenuDocument>, options?: QueryOptions) {
    return Topmenu.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<TopmenuDocument>, options?: QueryOptions) {
    return Topmenu.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<TopmenuDocument>,
    options?: QueryOptions
  ) {
    return Topmenu.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Topmenu.findByIdAndDelete(id, options);
  }
}

export { TopmenuRepository };
