import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { SettingsRepository } from "@app/repositories/settingsRepository";
import { SettingsDocument } from "@app/models/settings.model";
import { UsersDocument } from "@app/models/users.model";

class SettingsService {
  private repository: SettingsRepository;

  constructor(repository: SettingsRepository) {
    this.repository = repository;
  }

  ensureSuperadmin(user: UsersDocument) {
    const rolesControl = user.role || {};
    if (!rolesControl.superadmin) {
      throw new ForbiddenError("You are not authorized");
    }
  }

  async listSettings(user: UsersDocument) {
    this.ensureSuperadmin(user);
    return this.repository.findAll();
  }

  async getSettingsById(user: UsersDocument, id: string) {
    this.ensureSuperadmin(user);
    const data = await this.repository.findById(id);
    if (!data) {
      throw new NotFoundError("Settings not found");
    }
    return data;
  }

  async updateSettings(
    user: UsersDocument,
    id: string,
    payload: Partial<SettingsDocument>,
    session?: ClientSession
  ) {
    this.ensureSuperadmin(user);
    const updated = await this.repository.updateById(
      id,
      payload,
      session ? { session } : undefined
    );
    if (!updated) {
      throw new NotFoundError("Settings not found");
    }
    await deleteCacheByPrefix("public:catalog:");
    return updated;
  }
}

export { SettingsService };
