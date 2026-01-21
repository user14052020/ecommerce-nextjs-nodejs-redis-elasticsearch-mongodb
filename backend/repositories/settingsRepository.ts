import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import Settings, { SettingsDocument } from "@app/models/settings.model";

class SettingsRepository {
  findAll(filter?: FilterQuery<SettingsDocument>, options?: QueryOptions) {
    return Settings.find(filter ?? {}, null, options ?? undefined);
  }

  findById(id: string, options?: QueryOptions) {
    return Settings.findById(id, null, options ?? undefined);
  }

  updateById(
    id: string,
    payload: UpdateQuery<SettingsDocument>,
    options?: QueryOptions
  ) {
    return Settings.findByIdAndUpdate(id, payload, {
      new: true,
      ...options,
    });
  }
}

export { SettingsRepository };
