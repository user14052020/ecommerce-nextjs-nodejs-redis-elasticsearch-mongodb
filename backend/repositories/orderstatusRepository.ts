import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Orderstatus, {
  OrderstatusDocument,
} from "@app/models/orderstatus.model";

class OrderstatusRepository {
  findAll(filter?: FilterQuery<OrderstatusDocument>, options?: QueryOptions) {
    return Orderstatus.find(filter ?? {}, null, options ?? undefined).sort({
      order: 1,
    });
  }

  findById(id: string, options?: QueryOptions) {
    return Orderstatus.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<OrderstatusDocument>, options?: QueryOptions) {
    return Orderstatus.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<OrderstatusDocument>, options?: QueryOptions) {
    return Orderstatus.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<OrderstatusDocument>,
    options?: QueryOptions
  ) {
    return Orderstatus.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Orderstatus.findByIdAndDelete(id, options);
  }
}

export { OrderstatusRepository };
