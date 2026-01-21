import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { OrdersRepository } from "@app/repositories/ordersRepository";
import { OrdersDocument } from "@app/models/orders.model";
import { UsersDocument } from "@app/models/users.model";

class OrdersService {
  private repository: OrdersRepository;

  constructor(repository: OrdersRepository) {
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
      return { customer_id: `${user._id}` };
    }
    throw new ForbiddenError("You are not authorized");
  }

  ensureRole(user: UsersDocument, permission: string) {
    const rolesControl = user.role || {};
    if (!rolesControl[permission]) {
      throw new ForbiddenError("You are not authorized");
    }
  }

  async listOrders(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "orders");
    return this.repository.findAll(filter);
  }

  async countOrders() {
    return this.repository.count();
  }

  async getOrderById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["orders/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Order not found");
      }
      return data;
    }
    if (rolesControl["ordersonlyyou"]) {
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

  async listOrdersByStatus(user: UsersDocument, statusId: string) {
    const rolesControl = user.role || {};
    if (rolesControl["orders/list"]) {
      return this.repository.findAll({ orderstatus_id: statusId });
    }
    if (rolesControl["ordersonlyyou"]) {
      return this.repository.findAll({
        orderstatus_id: statusId,
        "created_user.id": `${user._id}`,
      });
    }
    if (user._id) {
      return this.repository.findAll({
        orderstatus_id: statusId,
        customer_id: `${user._id}`,
      });
    }
    throw new ForbiddenError("You are not authorized");
  }

  async createOrder(
    user: UsersDocument,
    payload: Partial<OrdersDocument>,
    session?: ClientSession
  ) {
    this.ensureRole(user, "orders/add");
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateOrder(
    user: UsersDocument,
    id: string,
    payload: Partial<OrdersDocument>,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["orders/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Order not found");
      }
      return updated;
    }
    if (rolesControl["ordersonlyyou"]) {
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

  async deleteOrder(
    user: UsersDocument,
    id: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["ordersdelete"]) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Order not found");
      }
      return deleted;
    }
    if (rolesControl["ordersonlyyou"]) {
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

export { OrdersService };
