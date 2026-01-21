import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicCatalogService } from "@app/core/dependencies";

const router = Router();

router.route("/").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getPaymentmethods();
    res.json(data);
  })
);

router.route("/:id").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getPaymentmethodById(req.params.id);
    res.json(data);
  })
);

export default router;
