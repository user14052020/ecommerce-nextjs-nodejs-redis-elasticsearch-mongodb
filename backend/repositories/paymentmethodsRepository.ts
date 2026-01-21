import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Paymentmethods, {
  PaymentmethodsDocument,
} from "@app/models/paymentmethods.model";

class PaymentmethodsRepository {
  findAll(
    filter?: FilterQuery<PaymentmethodsDocument>,
    options?: QueryOptions
  ) {
    return Paymentmethods.find(filter ?? {}, null, options ?? undefined).sort({
      order: 1,
    });
  }

  findById(id: string, options?: QueryOptions) {
    return Paymentmethods.findById(id, null, options ?? undefined);
  }

  findOne(
    filter?: FilterQuery<PaymentmethodsDocument>,
    options?: QueryOptions
  ) {
    return Paymentmethods.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<PaymentmethodsDocument>, options?: QueryOptions) {
    return Paymentmethods.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<PaymentmethodsDocument>,
    options?: QueryOptions
  ) {
    return Paymentmethods.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Paymentmethods.findByIdAndDelete(id, options);
  }
}

export { PaymentmethodsRepository };
