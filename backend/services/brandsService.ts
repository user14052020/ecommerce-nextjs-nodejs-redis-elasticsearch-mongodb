import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { BrandsRepository } from "@app/repositories/brandsRepository";
import { BrandsDocument } from "@app/models/brands.model";
import { UsersDocument } from "@app/models/users.model";
import { SearchService } from "@app/services/searchService";

class BrandsService {
  private repository: BrandsRepository;
  private searchService: SearchService | undefined;

  constructor(repository: BrandsRepository, searchService?: SearchService) {
    this.repository = repository;
    this.searchService = searchService;
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

  async listBrands(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "brands");
    return this.repository.findAll(filter);
  }

  async countBrands() {
    return this.repository.count();
  }

  async getBrandById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["brands/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Brand not found");
      }
      return data;
    }
    if (rolesControl["brandsonlyyou"]) {
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

  async createBrand(
    user: UsersDocument,
    payload: Partial<BrandsDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "brands/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await this.searchService?.indexBrand(created);
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updateBrand(
    user: UsersDocument,
    id: string,
    payload: Partial<BrandsDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["brands/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Brand not found");
      }
      await this.searchService?.indexBrand(updated);
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["brandsonlyyou"]) {
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
      await this.searchService?.indexBrand(updated);
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async deleteBrand(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["brandsdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Brand not found");
      }
      await this.searchService?.deleteBrand(id);
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["brandsonlyyou"]) {
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
      await this.searchService?.deleteBrand(id);
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { BrandsService };
