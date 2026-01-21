import { FilterQuery, QueryOptions } from "mongoose";
import Turkey, { TurkeyDocument } from "@app/models/turkey.model";

class TurkeyRepository {
  findAll(filter?: FilterQuery<TurkeyDocument>, options?: QueryOptions) {
    return Turkey.find(filter ?? {}, null, options ?? undefined);
  }

  findByCity(city: string, options?: QueryOptions) {
    return Turkey.find({ Il: city }, null, options ?? undefined);
  }
}

export { TurkeyRepository };
