import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPaymentmethodsService, getUnitOfWork } from "@app/core/dependencies";
import {
  createPaymentmethodSchema,
  updatePaymentmethodSchema,
} from "@app/validators/paymentmethodsValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

const title = "Payment Methods";

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getPaymentmethodsService();
      const data = await service.listPaymentmethods(
        (req as AuthenticatedRequest).user
      );
      res.json(data);
    })
  );

router
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getPaymentmethodsService();
      const payload = await validatePayload(createPaymentmethodSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.createPaymentmethod(
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
      });
    })
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getPaymentmethodsService();
      const data = await service.getPaymentmethodById(
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
      const service = getPaymentmethodsService();
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.deletePaymentmethod(
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
  .route("/active/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getPaymentmethodsService();
      const payload = await validatePayload(updatePaymentmethodSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updatePaymentmethod(
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
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getPaymentmethodsService();
      const payload = await validatePayload(updatePaymentmethodSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updatePaymentmethod(
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
