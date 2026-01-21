import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Users, { UsersDocument } from "@app/models/users.model";

class UsersRepository {
  findOne(filter?: FilterQuery<UsersDocument>, options?: QueryOptions) {
    return Users.findOne(filter ?? {}, null, options ?? undefined);
  }

  create(payload: Partial<UsersDocument>, options?: QueryOptions) {
    return Users.create([payload], options).then((docs) => docs[0]);
  }

  updateOne(
    filter: FilterQuery<UsersDocument>,
    payload: UpdateQuery<UsersDocument>,
    options?: QueryOptions
  ) {
    return Users.updateOne(filter, payload, options ?? undefined);
  }
}

export { UsersRepository };
