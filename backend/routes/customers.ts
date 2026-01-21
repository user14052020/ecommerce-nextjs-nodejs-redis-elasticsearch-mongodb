import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getCustomersService, getUnitOfWork } from "@app/core/dependencies";
import {
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerPasswordSchema,
} from "@app/validators/customersValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

const title = "User";

router.post(
  "/updatePasswordCustomer",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getCustomersService();
    const payload = await validatePayload(updateCustomerPasswordSchema, req.body);
    const uow = await getUnitOfWork();
    try {
      await uow.withTransaction(async (session) => {
        await service.updateCustomerPassword(
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
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const data = await service.listCustomers((req as AuthenticatedRequest).user);
      res.json(data);
    })
  );

router
  .route("/counts/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (_req, res: Response) => {
      const service = getCustomersService();
      const count = await service.countCustomers();
      res.json(count);
    })
  );

router
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const payload = await validatePayload(createCustomerSchema, req.body);
      const uow = await getUnitOfWork();
      let data;
      try {
        await uow.withTransaction(async (session) => {
          data = await service.createCustomer(
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
  .route("/active/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const payload = await validatePayload(updateCustomerSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateCustomer(
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

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const data = await service.getCustomerById(
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
      const service = getCustomersService();
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.deleteCustomer(
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

router
  .route("/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const payload = await validatePayload(updateCustomerSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateCustomer(
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

export default router;
