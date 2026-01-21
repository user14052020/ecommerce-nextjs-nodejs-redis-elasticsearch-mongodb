import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Basket, { BasketDocument } from "@app/models/basket.model";

class BasketRepository {
  findAll(filter?: FilterQuery<BasketDocument>, options?: QueryOptions) {
    return Basket.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Basket.findById(id, null, options ?? undefined);
  }

  create(payload: Partial<BasketDocument>, options?: QueryOptions) {
    return Basket.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<BasketDocument>,
    options?: QueryOptions
  ) {
    return Basket.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Basket.findByIdAndDelete(id, options);
  }
}

export { BasketRepository };
