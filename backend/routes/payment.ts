import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPaymentService, getUnitOfWork } from "@app/core/dependencies";

const router = Router();

router.route("/stripe").post(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPaymentService();
    const data = await service.createStripePayment(req.body);
    if (!data) {
      return res.status(400).json({
        messagge: "Payment method not available",
        variant: "error",
      });
    }
    res.json(data);
  })
);

router.route("/stripeokey").post(
  asyncHandler(async (req: Request, res: Response) => {
    const { ids, items, basket } = req.body;
    const service = getPaymentService();
    const uow = await getUnitOfWork();
    let order;
    try {
      await uow.withTransaction(async (session) => {
        order = await service.createOrderFromRequest(
          ids,
          items,
          basket,
          session
        );
      });
    } finally {
      await uow.end();
    }
    res.json(order);
  })
);

router.route("/stripeokeyconfirm/:pi_key").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPaymentService();
    const paymentIntent = await service.confirmPayment(req.params.pi_key);
    res.json(paymentIntent);
  })
);

router.route("/stripeconfirm/:payment_intent/:ordernumber").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPaymentService();
    const data = await service.findOrderByPaymentIntent(req.params);
    res.json(data);
  })
);

export default router;
