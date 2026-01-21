import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { TopmenuRepository } from "@app/repositories/topmenuRepository";
import { TopmenuDocument } from "@app/models/topmenu.model";
import { UsersDocument } from "@app/models/users.model";

class TopmenuService {
  private repository: TopmenuRepository;

  constructor(repository: TopmenuRepository) {
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

  async listTopmenu(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "topmenu");
    return this.repository.findAll(filter);
  }

  async getTopmenuById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["topmenu/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Top menu item not found");
      }
      return data;
    }
    if (rolesControl["topmenuonlyyou"]) {
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

  async createTopmenu(
    user: UsersDocument,
    payload: Partial<TopmenuDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "topmenu/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updateTopmenu(
    user: UsersDocument,
    id: string,
    payload: Partial<TopmenuDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["topmenu/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Top menu item not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["topmenuonlyyou"]) {
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

  async deleteTopmenu(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["topmenudelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Top menu item not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["topmenuonlyyou"]) {
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

export { TopmenuService };
