import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Users, { UsersDocument } from "@app/models/users.model";

type Projection = Record<string, 0 | 1> | null;

class CustomersRepository {
  findAll(
    filter?: FilterQuery<UsersDocument>,
    projection?: Projection | null,
    options?: QueryOptions
  ) {
    return Users.find(filter ?? {}, projection ?? null, options ?? undefined);
  }

  findById(
    id: string,
    projection?: Projection | null,
    options?: QueryOptions
  ) {
    return Users.findById(id, projection ?? null, options ?? undefined);
  }

  findOne(
    filter?: FilterQuery<UsersDocument>,
    projection?: Projection | null,
    options?: QueryOptions
  ) {
    return Users.findOne(filter ?? {}, projection ?? null, options ?? undefined);
  }

  create(payload: Partial<UsersDocument>, options?: QueryOptions) {
    return Users.create([payload], options).then((docs) => docs[0]);
  }

  updateById(
    id: string,
    payload: UpdateQuery<UsersDocument>,
    options?: QueryOptions
  ) {
    return Users.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }

  updateOne(
    filter: FilterQuery<UsersDocument>,
    payload: UpdateQuery<UsersDocument>,
    options?: QueryOptions
  ) {
    return Users.findOneAndUpdate(filter, payload, {
      new: true,
      ...options,
    });
  }

  deleteOne(filter: FilterQuery<UsersDocument>, options?: QueryOptions) {
    return Users.deleteOne(filter, options);
  }

  count(filter?: FilterQuery<UsersDocument>) {
    return Users.countDocuments(filter ?? {});
  }
}

export { CustomersRepository };
