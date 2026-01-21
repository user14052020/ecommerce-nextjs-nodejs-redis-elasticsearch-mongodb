import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Cargoes, { CargoesDocument } from "@app/models/cargoes.model";

class CargoesRepository {
  findAll(filter?: FilterQuery<CargoesDocument>, options?: QueryOptions) {
    return Cargoes.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Cargoes.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<CargoesDocument>, options?: QueryOptions) {
    return Cargoes.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<CargoesDocument>, options?: QueryOptions) {
    return Cargoes.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<CargoesDocument>,
    options?: QueryOptions
  ) {
    return Cargoes.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  deleteById(id: string, options?: QueryOptions) {
    return Cargoes.findByIdAndDelete(id, options);
  }
}

export { CargoesRepository };
