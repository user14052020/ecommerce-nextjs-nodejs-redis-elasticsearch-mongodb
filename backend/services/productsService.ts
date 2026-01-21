import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { ProductsRepository } from "@app/repositories/productsRepository";
import { ProductsDocument } from "@app/models/products.model";
import { UsersDocument } from "@app/models/users.model";
import { SearchService } from "@app/services/searchService";

class ProductsService {
  private repository: ProductsRepository;
  private searchService: SearchService | undefined;

  constructor(repository: ProductsRepository, searchService?: SearchService) {
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

  async listProducts(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "products");
    return this.repository.findAll(filter);
  }

  async countProducts() {
    return this.repository.count();
  }

  async statisticByCategory(user: UsersDocument) {
    this.ensureRole(user, "products/list");
    return this.repository.aggregateByCategory();
  }

  async getProductById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["products/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Product not found");
      }
      return data;
    }
    if (rolesControl["productsonlyyou"]) {
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

  async createProduct(
    user: UsersDocument,
    payload: Partial<ProductsDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "products/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await this.searchService?.indexProduct(created);
    await deleteCacheByPrefix("public:products:");
    return created;
  }

  async updateProduct(
    user: UsersDocument,
    id: string,
    payload: Partial<ProductsDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["products/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Product not found");
      }
      await this.searchService?.indexProduct(updated);
      await deleteCacheByPrefix("public:products:");
      return updated;
    }
    if (rolesControl["productsonlyyou"]) {
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
      await this.searchService?.indexProduct(updated);
      await deleteCacheByPrefix("public:products:");
      return updated;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async deleteProduct(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["productsdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Product not found");
      }
      await this.searchService?.deleteProduct(id);
      await deleteCacheByPrefix("public:products:");
      return deleted;
    }
    if (rolesControl["productsonlyyou"]) {
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
      await this.searchService?.deleteProduct(id);
      await deleteCacheByPrefix("public:products:");
      return deleted;
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { ProductsService };
