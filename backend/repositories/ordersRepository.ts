import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Orders, { OrdersDocument } from "@app/models/orders.model";

class OrdersRepository {
  findAll(filter?: FilterQuery<OrdersDocument>, options?: QueryOptions) {
    return Orders.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Orders.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<OrdersDocument>, options?: QueryOptions) {
    return Orders.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<OrdersDocument>, options?: QueryOptions) {
    return Orders.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<OrdersDocument>,
    options?: QueryOptions
  ) {
    return Orders.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Orders.findByIdAndDelete(id, options);
  }

  count(filter?: FilterQuery<OrdersDocument>) {
    return Orders.countDocuments(filter ?? {});
  }
}

export { OrdersRepository };
