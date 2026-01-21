import { Router, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicCatalogService } from "@app/core/dependencies";

const router = Router();

router.route("/").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getCargoes();
    res.json(data);
  })
);

export default router;
