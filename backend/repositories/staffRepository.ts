import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Users, { UsersDocument } from "@app/models/users.model";

class StaffRepository {
  findAll(filter?: FilterQuery<UsersDocument>, options?: QueryOptions) {
    return Users.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Users.findById(id, null, options ?? undefined);
  }

  findOne(filter?: FilterQuery<UsersDocument>, options?: QueryOptions) {
    return Users.findOne(filter ?? {}, null, options ?? undefined);
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

  deleteById(id: string, options?: QueryOptions) {
    return Users.findByIdAndDelete(id, options);
  }

  deleteOne(filter: FilterQuery<UsersDocument>, options?: QueryOptions) {
    return Users.deleteOne(filter, options);
  }
}

export { StaffRepository };
