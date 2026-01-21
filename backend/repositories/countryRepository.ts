import { FilterQuery, QueryOptions } from "mongoose";
import Country, { CountryDocument } from "@app/models/country.model";

class CountryRepository {
  findAll(filter?: FilterQuery<CountryDocument>, options?: QueryOptions) {
    return Country.find(filter ?? {}, null, options ?? undefined);
  }

  findByName(name: string, options?: QueryOptions) {
    return Country.find({ name }, null, options ?? undefined);
  }
}

export { CountryRepository };
