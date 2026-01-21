import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { CategoriesRepository } from "@app/repositories/categoriesRepository";
import { CategoriesDocument } from "@app/models/categories.model";
import { UsersDocument } from "@app/models/users.model";
import { SearchService } from "@app/services/searchService";

class CategoriesService {
  private repository: CategoriesRepository;
  private searchService: SearchService | undefined;

  constructor(repository: CategoriesRepository, searchService?: SearchService) {
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

  async listCategories(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "categories");
    return this.repository.findAll(filter);
  }

  async countCategories() {
    return this.repository.count();
  }

  async getCategoryById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["categories/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Category not found");
      }
      return data;
    }
    if (rolesControl["categoriesonlyyou"]) {
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

  async createCategory(
    user: UsersDocument,
    payload: Partial<CategoriesDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "categories/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await this.searchService?.indexCategory(created);
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updateCategory(
    user: UsersDocument,
    id: string,
    payload: Partial<CategoriesDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["categories/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Category not found");
      }
      await this.searchService?.indexCategory(updated);
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["categoriesonlyyou"]) {
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
      await this.searchService?.indexCategory(updated);
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async deleteCategory(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["categoriesdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Category not found");
      }
      await this.searchService?.deleteCategory(id);
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["categoriesonlyyou"]) {
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
      await this.searchService?.deleteCategory(id);
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { CategoriesService };
