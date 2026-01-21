import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getStaffService, getUnitOfWork } from "@app/core/dependencies";
import {
  createStaffSchema,
  updateStaffSchema,
  updatePasswordSchema,
  registerStaffSchema,
} from "@app/validators/staffValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";
import type { UsersDocument } from "@app/models/users.model";

const router = Router();

const title = "Staff";

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getStaffService();
      const data = await service.listStaff((req as AuthenticatedRequest).user);
      res.json(data);
    })
  );

router
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getStaffService();
      const payload = await validatePayload(createStaffSchema, req.body);
      const uow = await getUnitOfWork();
      let data;
      try {
        await uow.withTransaction(async (session) => {
          data = await service.createStaff(
            (req as AuthenticatedRequest).user,
            payload as Record<string, unknown>,
            session
          );
        });
      } finally {
        await uow.end();
      }
      res.json({
        messagge: title + " Added",
        variant: "success",
        data,
      });
    })
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getStaffService();
      const data = await service.getStaffById(
        (req as AuthenticatedRequest).user,
        req.params.id
      );
      res.json(data);
    })
  );

router
  .route("/:id")
  .delete(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getStaffService();
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.deleteStaff(
            (req as AuthenticatedRequest).user,
            req.params.id,
            session
          );
        });
      } finally {
        await uow.end();
      }
      res.json({
        messagge: title + " Deleted",
        variant: "info",
      });
    })
  );

router.post(
  "/updatePasswordSuperadmin",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getStaffService();
    const payload = await validatePayload(updatePasswordSchema, req.body);
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.updatePasswordSuperadmin(
          (req as AuthenticatedRequest).user,
          (payload as { _id: string })._id,
          (payload as { password: string }).password,
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.json({
      messagge: title + " Password Update",
      variant: "success",
    });
  })
);

router.post(
  "/updatePasswordCustomer",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getStaffService();
    const payload = await validatePayload(updatePasswordSchema, req.body);
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.updatePasswordCustomer(
          (req as AuthenticatedRequest).user,
          (payload as { _id: string })._id,
          (payload as { password: string }).password,
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.json({
      messagge: title + " Password Update",
      variant: "success",
    });
  })
);

router
  .route("/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getStaffService();
      const payload = await validatePayload(updateStaffSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateStaff(
            (req as AuthenticatedRequest).user,
            req.params.id,
            payload as Record<string, unknown>,
            session
          );
        });
      } finally {
        await uow.end();
      }
      res.json({
        messagge: title + " Update",
        variant: "success",
      });
    })
  );

router.route("/add/register1231223123123").post(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getStaffService();
    const payload = await validatePayload(registerStaffSchema, req.body);
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.registerStaff(
          payload as Partial<UsersDocument> & { role?: Record<string, boolean> },
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.json({
      messagge: title + " Added",
      variant: "success",
    });
  })
);

export default router;
