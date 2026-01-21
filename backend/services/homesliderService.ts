import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { HomesliderRepository } from "@app/repositories/homesliderRepository";
import { HomesliderDocument } from "@app/models/homeslider.model";
import { UsersDocument } from "@app/models/users.model";

class HomesliderService {
  private repository: HomesliderRepository;

  constructor(repository: HomesliderRepository) {
    this.repository = repository;
  }

  resolveRoleFilter(user: UsersDocument, roleTitle: string) {
    const rolesControl = user.role || {};
    if (rolesControl[roleTitle + "/list"]) {
      return {};
    }
    if (rolesControl[roleTitle + "onlyyou"]) {
      return { "created_user.id": `${user._id}` };
    }
    throw new ForbiddenError("You are not authorized");
  }

  ensureRole(user: UsersDocument, permission: string) {
    const rolesControl = user.role || {};
    if (!rolesControl[permission]) {
      throw new ForbiddenError("You are not authorized");
    }
  }

  async listHomesliders(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "homeslider");
    return this.repository.findAll(filter);
  }

  async getHomesliderById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["homeslider/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Homeslider not found");
      }
      return data;
    }
    if (rolesControl["homeslideronlyyou"]) {
      const data = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
      });
      if (!data) {
        throw new ForbiddenError("You are not authorized");
      }
      return data;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async createHomeslider(
    user: UsersDocument,
    payload: Partial<HomesliderDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "homeslider/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updateHomeslider(
    user: UsersDocument,
    id: string,
    payload: Partial<HomesliderDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["homeslider/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Homeslider not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["homeslideronlyyou"]) {
      const found = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
      });
      if (!found) {
        throw new ForbiddenError("You are not authorized");
      }
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async deleteHomeslider(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["homesliderdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Homeslider not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["homeslideronlyyou"]) {
      const found = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
      });
      if (!found) {
        throw new ForbiddenError("You are not authorized");
      }
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { HomesliderService };
