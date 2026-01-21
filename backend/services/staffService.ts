import bcrypt from "bcryptjs";
import { ClientSession } from "mongoose";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@app/core/errors";
import { StaffRepository } from "@app/repositories/staffRepository";
import { UsersDocument } from "@app/models/users.model";

const BCRYPT_SALT_ROUNDS = 10;

type StaffPayload = Partial<UsersDocument> & {
  role?: Record<string, boolean>;
};

class StaffService {
  private repository: StaffRepository;

  constructor(repository: StaffRepository) {
    this.repository = repository;
  }

  async listStaff(user: UsersDocument) {
    const rolesControl = user.role || {};
    if (rolesControl.superadmin) {
      return this.repository.findAll({ role: { $exists: true } });
    }
    if (rolesControl["staff/list"]) {
      return this.repository.findAll({
        $and: [
          { role: { $exists: true } },
          { "role.superadmin": { $exists: false } },
        ],
      });
    }
    if (rolesControl.staffonlyyou) {
      return this.repository.findAll({
        $or: [{ _id: user._id }, { "created_user.id": `${user._id}` }],
      });
    }
    throw new ForbiddenError("You are not authorized");
  }

  async getStaffById(user: UsersDocument, id: string) {
    const rolesControl = user.role || {};
    if (rolesControl["staff/list"]) {
      const data = await this.repository.findById(id);
      if (!data) {
        throw new NotFoundError("Staff not found");
      }
      return data;
    }
    if (rolesControl.staffonlyyou) {
      const data = await this.repository.findOne({
        "created_user.id": `${user._id}`,
      });
      if (!data) {
        throw new ForbiddenError("You are not authorized");
      }
      return data;
    }
    throw new ForbiddenError("You are not authorized");
  }

  async createStaff(
    user: UsersDocument,
    payload: StaffPayload,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (!rolesControl["staff/add"]) {
      throw new ForbiddenError("You are not authorized");
    }
    if (payload.role && payload.role.superadmin) {
      payload.role.superadmin = false;
    }
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async registerStaff(payload: StaffPayload, session?: ClientSession) {
    if (payload.role && payload.role.superadmin) {
      payload.role.superadmin = false;
    }
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updateStaff(
    user: UsersDocument,
    id: string,
    payload: StaffPayload,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (rolesControl["staff/id"]) {
      const updated = await this.repository.updateById(
        id,
        payload,
        session ? { session } : undefined
      );
      if (!updated) {
        throw new NotFoundError("Staff not found");
      }
      return updated;
    }
    if (rolesControl.staffonlyyou) {
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

  async deleteStaff(user: UsersDocument, id: string, session?: ClientSession) {
    if (`${id}` === `${user._id}`) {
      throw new ValidationError("Can not delete yourself.");
    }

    const rolesControl = user.role || {};
    if (rolesControl.staffdelete) {
      const deleted = await this.repository.deleteById(
        id,
        session ? { session } : undefined
      );
      if (!deleted) {
        throw new NotFoundError("Staff not found");
      }
      return deleted;
    }
    if (rolesControl.staffonlyyou) {
      const deleted = await this.repository.deleteOne(
        {
          _id: id,
          "created_user.id": `${user._id}`,
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

  async updatePasswordSuperadmin(
    user: UsersDocument,
    id: string,
    password: string,
    session?: ClientSession
  ) {
    const rolesControl = user.role || {};
    if (!(rolesControl.superadmin || `${user._id}` === `${id}`)) {
      throw new ForbiddenError("You are not authorized");
    }

    const staff = await this.repository.findById(id);
    if (!staff) {
      throw new NotFoundError("Staff not found");
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return this.repository.updateOne(
      { _id: id },
      { password: hashedPassword },
      session ? { session } : undefined
    );
  }

  async updatePasswordCustomer(
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
}

export { StaffService };
