import { Request } from "express";
import { UsersDocument } from "@app/models/users.model";

export type AuthenticatedRequest = Request & {
  user: UsersDocument;
};
