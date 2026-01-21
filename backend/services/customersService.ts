import bcrypt from "bcryptjs";
import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { CustomersRepository } from "@app/repositories/customersRepository";
import { UsersDocument } from "@app/models/users.model";

const BCRYPT_SALT_ROUNDS = 10;

type CustomerPayload = Partial<UsersDocument>;

class CustomersService {
  private repository: CustomersRepository;

  constructor(repository: CustomersRepository) {
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

  async listCustomers(user: UsersDocument) {
    const filter = this.resolveRoleFilter(user, "customers");
    const projection: Record<string, 0 | 1> = {
      isActive: 1,
      name: 1,
      surname: 1,
      username: 1,
      _id: 1,
      isCustomer: 1,
      address: 1,
      phone: 1,
      prefix: 1,
    };

    if ((filter as Record<string, unknown>)["created_user.id"]) {
      return this.repository.findAll(
        { ...filter, isCustomer: true },
        null
      );
    }

    return this.repository.findAll(
      { ...filter, isCustomer: true },
      projection
    );
  }

  async countCustomers() {
    return this.repository.count({ isCustomer: true });
  }

  async getCustomerById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["customers/list"] || `${user._id}` === `${id}`) {
      const data = await this.repository.findOne({
        _id: id,
      });
      if (!data) {
        throw new NotFoundError("Customer not found");
      }
      return data;
    }
    if (rolesControl["customersonlyyou"]) {
      const data = await this.repository.findOne({
        _id: id,
        "created_user.id": `${user._id}`,
        isCustomer: true,
      });
      if (!data) {
        throw new ForbiddenError("You are not authorized");
      }
      return data;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async createCustomer(
    user: UsersDocument,
    payload: CustomerPayload,
    session?: ClientSession
  ) {
    this.ensureRole(user, "customers/add");
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateCustomer(
    user: UsersDocument,
    id: string,
    payload: CustomerPayload,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["customers/id"] || `${user._id}` === `${id}`) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Customer not found");
      }
      return updated;
    }
    if (rolesControl["customersonlyyou"]) {
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

  async updateCustomerPassword(
    user: UsersDocument,
    id: string,
    password: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (!(rolesControl["customers/id"] || `${user._id}` === `${id}`)) {
      throw new ForbiddenError("You are not authorized");
    }

    const customer = await this.repository.findOne({
      _id: id,
      isCustomer: true,
    });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return this.repository.updateOne(
      { _id: id },
      { password: hashedPassword },
      session ? { session } : undefined
    );
  }

  async updateCustomerAddress(
    user: UsersDocument,
    address: UsersDocument["address"],
    session?: ClientSession
  ) {
    const updated = await this.repository.updateOne(
      { username: user.username },
      { $set: { address } },
      session ? { session } : undefined
    );
    return updated;
  }

  async deleteCustomer(user: UsersDocument, id: string, session?: ClientSession) {
    const rolesControl = user.role || {};
    if (rolesControl["customersdelete"]) {
      const deleted = await this.repository.deleteOne(
        { _id: id, isCustomer: true },
        session ? { session } : undefined
      );
      if (!deleted || deleted.deletedCount === 0) {
        throw new NotFoundError("Customer not found");
      }
      return deleted;
    }
    if (rolesControl["customersonlyyou"]) {
      const deleted = await this.repository.deleteOne(
        {
          _id: id,
          "created_user.id": `${user._id}`,
          isCustomer: true,
        },
        session ? { session } : undefined
      );
      if (!deleted || deleted.deletedCount === 0) {
        throw new ForbiddenError("You are not authorized");
      }
      return deleted;
    }
    throw new ForbiddenError("You are not authorized");
  }
}

export { CustomersService };
