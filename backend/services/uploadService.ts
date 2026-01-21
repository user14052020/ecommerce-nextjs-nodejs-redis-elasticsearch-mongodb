import fs from "fs/promises";
import { ForbiddenError, ValidationError } from "@app/core/errors";
import { UsersDocument } from "@app/models/users.model";

type UploadBodyItem = { thumbUrl?: string };

class UploadService {
  ensureRole(user: UsersDocument, permission: string) {
    const rolesControl = user.role || {};
    if (!rolesControl[permission]) {
      throw new ForbiddenError("You are not authorized, go away!");
    }
  }

  ensureSuperadmin(user: UsersDocument) {
    const rolesControl = user.role || {};
    if (!rolesControl.superadmin) {
      throw new ForbiddenError("You are not authorized, go away!");
    }
  }

  async writeBase64Image(targetPath: string, body: UploadBodyItem[]) {
    if (!body[0]) {
      return "/admin/public";
    }
    const imgdata = body[0].thumbUrl;
    if (!imgdata) {
      return "/admin/public";
    }
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");
    await fs.writeFile(targetPath, base64Data, { encoding: "base64" });
    return targetPath;
  }

  async deleteFile(path: string) {
    if (!path) {
      throw new ValidationError("Missing path");
    }
    try {
      await fs.unlink(path);
    } catch {
      // Ignore missing files to keep delete idempotent.
    }
  }
}

export { UploadService };
