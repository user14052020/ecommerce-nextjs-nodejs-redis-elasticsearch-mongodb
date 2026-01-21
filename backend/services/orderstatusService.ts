import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { OrderstatusRepository } from "@app/repositories/orderstatusRepository";
import { OrderstatusDocument } from "@app/models/orderstatus.model";
import { UsersDocument } from "@app/models/users.model";

class OrderstatusService {
  private repository: OrderstatusRepository;

  constructor(repository: OrderstatusRepository) {
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
    if (user._id) {
      return {};
    }
    throw new ForbiddenError("You are not authorized");
  }

  ensureRole(user: UsersDocument, permission: string) {
    const rolesControl = user.role || {};
    if (!rolesControl[permission]) {
      throw new ForbiddenError("You are not authorized");
    }
  }

  async listOrderstatuses(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "orderstatus");
    return this.repository.findAll(filter);
  }

  async getOrderstatusById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["orderstatus/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Order status not found");
      }
      return data;
    }
    if (rolesControl["orderstatusonlyyou"]) {
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

  async createOrderstatus(
    user: UsersDocument,
    payload: Partial<OrderstatusDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "orderstatus/add");
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateOrderstatus(
    user: UsersDocument,
    id: string,
    payload: Partial<OrderstatusDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["orderstatus/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Order status not found");
      }
      return updated;
    }
    if (rolesControl["orderstatusonlyyou"]) {
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

  async deleteOrderstatus(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["orderstatusdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Order status not found");
      }
      return deleted;
    }
    if (rolesControl["orderstatusonlyyou"]) {
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

export { OrderstatusService };
