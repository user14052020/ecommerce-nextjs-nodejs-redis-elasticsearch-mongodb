import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { deleteCacheByPrefix } from "@app/core/cache";
import { PaymentmethodsRepository } from "@app/repositories/paymentmethodsRepository";
import { PaymentmethodsDocument } from "@app/models/paymentmethods.model";
import { UsersDocument } from "@app/models/users.model";

class PaymentmethodsService {
  private repository: PaymentmethodsRepository;

  constructor(repository: PaymentmethodsRepository) {
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

  async listPaymentmethods(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "paymentmethods");
    return this.repository.findAll(filter);
  }

  async getPaymentmethodById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["paymentmethods/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Payment method not found");
      }
      return data;
    }
    if (rolesControl["paymentmethodsonlyyou"]) {
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

  async createPaymentmethod(
    user: UsersDocument,
    payload: Partial<PaymentmethodsDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "paymentmethods/add");
    const created = await this.repository.create(
      payload,
      session ? { session } : undefined
    );
    await deleteCacheByPrefix("public:catalog:");
    return created;
  }

  async updatePaymentmethod(
    user: UsersDocument,
    id: string,
    payload: Partial<PaymentmethodsDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["paymentmethods/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Payment method not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return updated;
    }
    if (rolesControl["paymentmethodsonlyyou"]) {
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

  async deletePaymentmethod(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["paymentmethodsdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Payment method not found");
      }
      await deleteCacheByPrefix("public:catalog:");
      return deleted;
    }
    if (rolesControl["paymentmethodsonlyyou"]) {
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

export { PaymentmethodsService };
