import { Router, Request, Response } from "express";
import passport from "passport";
import "@app/passportConfig";
import { WEBSITE_URL, maillerConfig } from "@app/config";
import nodemailer from "nodemailer";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getUsersService, getUnitOfWork } from "@app/core/dependencies";
import {
  registerSchema,
  updatePasswordViaEmailSchema,
  forgotPasswordSchema,
} from "@app/validators/usersValidator";
import { AuthenticatedRequest } from "@app/types/request";
import type { UsersDocument } from "@app/models/users.model";

import "dotenv/config";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

type AdminRequest = Request & { Users?: { role?: string } };

router.post(
  "/loginuser",
  passport.authenticate("local", { session: false }),
  (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const service = getUsersService();
      const token = service.signToken((req as AuthenticatedRequest).user._id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).json({
        isAuthenticated: true,
        user: service.buildAuthUserResponse((req as AuthenticatedRequest).user),
      });
    }
  }
);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const service = getUsersService();
      const token = service.signToken((req as AuthenticatedRequest).user._id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).json({
        isAuthenticated: true,
        user: service.buildAuthUserResponse((req as AuthenticatedRequest).user),
      });
    }
  }
);

router.put(
  "/updatePasswordViaEmail",
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUsersService();
    const payload = await validatePayload(updatePasswordViaEmailSchema, req.body);
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.updatePasswordViaEmail(
          payload as {
            username: string;
            resetPasswordToken: string;
            password: string;
          },
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.status(200).send({ message: "password updated" });
  })
);

router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const payload = (await validatePayload(registerSchema, req.body)) as Partial<
      UsersDocument
    > & {
      username: string;
      password: string;
    };
    const service = getUsersService();
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.register(
          {
            ...payload,
            isCustomer: true,
            created_user: { name: "register" },
          },
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.status(201).json({
      messagge: "Account successfully created",
      error: false,
    });
  })
);

router.get(
  "/reset",
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUsersService();
    const token =
      typeof req.query.resetPasswordToken === "string"
        ? req.query.resetPasswordToken
        : "";
    const user = await service.validateResetToken(token);
    res.status(200).send({
      username: user.username,
      message: "password reset link a-ok",
    });
  })
);

router.post(
  "/forgotPassword",
  asyncHandler(async (req: Request, res: Response) => {
    const payload = (await validatePayload(
      forgotPasswordSchema,
      req.body
    )) as { username: string };
    const service = getUsersService();
    const uow = await getUnitOfWork();
    let token;
    try {
      await uow.withTransaction(async (session) => {
        token = await service.requestPasswordReset(payload.username, session);
      });
    } finally {
      await uow.end();
    }

    const transporter = nodemailer.createTransport(maillerConfig);

    const mailOptions = {
      to: `${payload.username}`,
      from: `${maillerConfig.auth.user}`,
      subject: "Link To Reset Password",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `${process.env.ADMIN_SITE}/resetpassword/?token=${token}\n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("there was an error: ", err);
      } else {
        console.log("here is the res: ", response);
        res.status(200).json("recovery email sent");
      }
    });
  })
);

router.post(
  "/forgotpasswordcustomer",
  asyncHandler(async (req: Request, res: Response) => {
    const payload = (await validatePayload(
      forgotPasswordSchema,
      req.body
    )) as { username: string };
    const service = getUsersService();
    const uow = await getUnitOfWork();
    let token;
    try {
      await uow.withTransaction(async (session) => {
        token = await service.requestPasswordReset(payload.username, session);
      });
    } finally {
      await uow.end();
    }

    const transporter = nodemailer.createTransport(maillerConfig);

    const mailOptions = {
      to: `${payload.username}`,
      from: `${maillerConfig.auth.user}`,
      subject: "Link To Reset Password",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `${WEBSITE_URL}/resetpassword/?token=${token}\n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("there was an error: ", err);
      } else {
        console.log("here is the res: ", response);
        res.status(200).json("recovery email sent");
      }
    });
  })
);

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (_req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.json({
      user: {
        username: "",
        role: {},
        id: "",
        name: "",
        company: "",
        isCustomer: false,
        phone: "",
      },
      success: true,
    });
  }
);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req: AdminRequest, res: Response) => {
    if (req.Users?.role === "admin") {
      res.status(200).json({
        message: { msgBody: "You are an admin", msgError: false },
      });
    } else {
      res.status(403).json({
        message: {
          msgBody: "You're not an admin,go away",
          msgError: true,
        },
      });
    }
  }
);

router.get(
  "/authenticateduser",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    const service = getUsersService();
    res.status(200).json({
      isAuthenticated: true,
      user: service.buildAuthUserResponse((req as AuthenticatedRequest).user),
    });
  }
);

router.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    const service = getUsersService();
    res.status(200).json({
      isAuthenticated: true,
      user: service.buildAuthUserResponse((req as AuthenticatedRequest).user),
    });
  }
);

export default router;
