import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { CargoesRepository } from "@app/repositories/cargoesRepository";
import { CargoesDocument } from "@app/models/cargoes.model";
import { UsersDocument } from "@app/models/users.model";

class CargoesService {
  private repository: CargoesRepository;

  constructor(repository: CargoesRepository) {
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

  async listCargoes(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "cargoes");
    return this.repository.findAll(filter);
  }

  async getCargoById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["cargoes/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Cargo not found");
      }
      return data;
    }
    if (rolesControl["cargoesonlyyou"]) {
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

  async createCargo(
    user: UsersDocument,
    payload: Partial<CargoesDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "cargoes/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updateCargo(
    user: UsersDocument,
    id: string,
    payload: Partial<CargoesDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["cargoes/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Cargo not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["cargoesonlyyou"]) {
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

  async deleteCargo(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["cargoesdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Cargo not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["cargoesonlyyou"]) {
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

export { CargoesService };
