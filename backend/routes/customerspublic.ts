import { Router, Request, Response } from "express";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getCustomersService, getUnitOfWork } from "@app/core/dependencies";
import {
  updateCustomerPasswordSchema,
  updateCustomerAddressSchema,
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
  .route("/address")
  .post(
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getCustomersService();
      const payload = await validatePayload(updateCustomerAddressSchema, req.body);
      const uow = await getUnitOfWork();
      let data;
      try {
        await uow.withTransaction(async (session) => {
          data = await service.updateCustomerAddress(
            (req as AuthenticatedRequest).user,
            payload as AuthenticatedRequest["user"]["address"],
            session
          );
        });
      } finally {
        await uow.end();
      }
    const address = data ? (data as { address?: unknown }).address : undefined;
    res.json(address ?? payload);
    })
  );

export default router;
