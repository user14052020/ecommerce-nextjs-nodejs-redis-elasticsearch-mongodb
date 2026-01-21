import JWT from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ClientSession } from "mongoose";
import { ValidationError, NotFoundError } from "@app/core/errors";
import { UsersRepository } from "@app/repositories/usersRepository";
import { UsersDocument } from "@app/models/users.model";

const BCRYPT_SALT_ROUNDS = 10;

type RegisterPayload = Pick<UsersDocument, "username" | "password"> &
  Partial<UsersDocument>;

type ResetPasswordPayload = {
  username: string;
  resetPasswordToken: string;
  password: string;
};

class UsersService {
  private repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  signToken(userId: string): string {
    const secret = process.env.PASPORTJS_KEY;
    if (!secret) {
      throw new Error("PASPORTJS_KEY is not set");
    }
    return JWT.sign(
      {
        iss: secret,
        sub: userId,
      },
      secret,
      { expiresIn: "30 days" }
    );
  }

  buildAuthUserResponse(user: UsersDocument) {
    const {
      username,
      _id,
      name,
      surname,
      company,
      isCustomer,
      address,
      image,
      isActive,
      prefix,
      phone,
      role,
    } = user;

    return {
      username,
      role,
      id: _id,
      name: name + (surname ? " " + surname : ""),
      company,
      isCustomer,
      image,
      address,
      isActive,
      prefix,
      phone,
    };
  }

  async register(payload: RegisterPayload, session?: ClientSession) {
    const existing = await this.repository.findOne({
      username: payload.username,
    });
    if (existing) {
      throw new ValidationError("E-mail is already taken");
    }
    return this.repository.create(payload, session ? { session } : undefined);
  }

  async updatePasswordViaEmail(
    payload: ResetPasswordPayload,
    session?: ClientSession
  ) {
    const user = await this.repository.findOne({
      username: payload.username,
      resetPasswordToken: payload.resetPasswordToken,
      resetPasswordExpires: { $gte: Date.now() },
    });

    if (!user) {
      throw new NotFoundError("password reset link is invalid or has expired");
    }

    const hashedPassword = await bcrypt.hash(
      payload.password,
      BCRYPT_SALT_ROUNDS
    );
    await this.repository.updateOne(
      {
        username: payload.username,
      },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      session ? { session } : undefined
    );
  }

  async requestPasswordReset(username: string, session?: ClientSession) {
    const user = await this.repository.findOne({ username });
    if (!user) {
      throw new NotFoundError("email not in db");
    }

    const token = crypto.randomBytes(20).toString("hex");
    await this.repository.updateOne(
      { username },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      session ? { session } : undefined
    );
    return token;
  }

  async validateResetToken(token: string) {
    const user = await this.repository.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gte: Date.now() },
    });
    if (!user) {
      throw new NotFoundError("password reset link is invalid or has expired");
    }
    return user;
  }
}

export { UsersService };
