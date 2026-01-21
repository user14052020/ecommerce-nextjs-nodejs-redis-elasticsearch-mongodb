import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getSettingsService, getUnitOfWork } from "@app/core/dependencies";
import { updateSettingsSchema } from "@app/validators/settingsValidator";
import { AuthenticatedRequest } from "@app/types/request";
import { validatePayload } from "@app/utils/validatePayload";

const router = Router();

const title = "Settings";

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getSettingsService();
      const data = await service.listSettings((req as AuthenticatedRequest).user);
      res.json(data);
    })
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getSettingsService();
      const data = await service.getSettingsById(
        (req as AuthenticatedRequest).user,
        req.params.id
      );
      res.json(data);
    })
  );

router
  .route("/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getSettingsService();
      const payload = await validatePayload(updateSettingsSchema, req.body);
      const uow = await getUnitOfWork();
      try {
        await uow.withTransaction(async (session) => {
          await service.updateSettings(
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
