import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { ProductimagesRepository } from "@app/repositories/productimagesRepository";
import { ProductimagesDocument } from "@app/models/productimages.model";
import { UsersDocument } from "@app/models/users.model";

class ProductimagesService {
  private repository: ProductimagesRepository;

  constructor(repository: ProductimagesRepository) {
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

  async listProductimages(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "productimages");
    return this.repository.findAll(filter);
  }

  async listProductimagesWithProduct(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "productimages");
    return this.repository
      .findAll(filter)
      .populate("product_id")
      .sort({ order: 1 });
  }

  async statisticByCategory(user: UsersDocument) {
    this.ensureRole(user, "productimages/list");
    return this.repository.aggregateByCategory();
  }

  async getProductimageById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["productimages/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Product image not found");
      }
      return data;
    }
    if (rolesControl["productimagesonlyyou"]) {
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

  async createProductimage(
    user: UsersDocument,
    payload: Partial<ProductimagesDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "productimages/add");
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateProductimage(
    user: UsersDocument,
    id: string,
    payload: Partial<ProductimagesDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["productimages/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Product image not found");
      }
      return updated;
    }
    if (rolesControl["productimagesonlyyou"]) {
      const found = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
      });
      if (!found) {
        throw new ForbiddenError("You are not authorized");
      }
      return this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
    }
    throw new ForbiddenError("You are not authorized");
  }

  async deleteProductimage(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["productimagesdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Product image not found");
      }
      return deleted;
    }
    if (rolesControl["productimagesonlyyou"]) {
      const found = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
      });
      if (!found) {
        throw new ForbiddenError("You are not authorized");
      }
      return this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { ProductimagesService };
