import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { VariantsRepository } from "@app/repositories/variantsRepository";
import { VariantsDocument } from "@app/models/variants.model";
import { UsersDocument } from "@app/models/users.model";

class VariantsService {
  private repository: VariantsRepository;

  constructor(repository: VariantsRepository) {
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

  async listVariants(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "variants");
    return this.repository.findAll(filter);
  }

  async getVariantById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["variants/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Variant not found");
      }
      return data;
    }
    if (rolesControl["variantsonlyyou"]) {
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

  async createVariant(
    user: UsersDocument,
    payload: Partial<VariantsDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "variants/add");
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateVariant(
    user: UsersDocument,
    id: string,
    payload: Partial<VariantsDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["variants/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Variant not found");
      }
      return updated;
    }
    if (rolesControl["variantsonlyyou"]) {
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

  async deleteVariant(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["variantsdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Variant not found");
      }
      return deleted;
    }
    if (rolesControl["variantsonlyyou"]) {
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

export { VariantsService };
