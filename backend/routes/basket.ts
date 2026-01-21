import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getBasketService, getUnitOfWork } from "@app/core/dependencies";
import {
  createBasketSchema,
  updateBasketSchema,
} from "@app/validators/basketValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

const title = "Basket";

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getBasketService();
      const data = await service.listBaskets((req as AuthenticatedRequest).user);
      res.json(data);
    })
  );

router
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getBasketService();
      const payload = await validatePayload(createBasketSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.createBasket(
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
  .route("/allproducts")
  .post(
    asyncHandler(async (req: Request, res: Response) => {
      const service = getBasketService();
      const data = await service.listProductsByFilter(req.body);
      res.json(data);
    })
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getBasketService();
      const data = await service.getBasketById(
        (req as AuthenticatedRequest).user,
        req.params.id
      );
      res.json(data);
    })
  );

router
  .route("/customer/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getBasketService();
      const data = await service.listCustomerBasket(
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
      const service = getBasketService();
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.deleteBasket(
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
      const service = getBasketService();
      const payload = await validatePayload(updateBasketSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateBasket(
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
