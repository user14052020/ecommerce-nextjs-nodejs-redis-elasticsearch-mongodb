import { Router, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getProductsService, getUnitOfWork } from "@app/core/dependencies";
import {
  createProductSchema,
  updateProductSchema,
} from "@app/validators/productsValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

const title = "Products";

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const data = await service.listProducts((req as AuthenticatedRequest).user);
      res.json(data);
    })
  );

router
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const payload = await validatePayload(createProductSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.createProduct(
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
  .route("/counts/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (_req, res: Response) => {
      const service = getProductsService();
      const count = await service.countProducts();
      res.json(count);
    })
  );

router
  .route("/statistic")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const data = await service.statisticByCategory(
        (req as AuthenticatedRequest).user
      );
      res.json(data);
    })
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const data = await service.getProductById(
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
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.deleteProduct(
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
    asyncHandler(async (req, res: Response) => {
      const service = getProductsService();
      const payload = await validatePayload(updateProductSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateProduct(
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
