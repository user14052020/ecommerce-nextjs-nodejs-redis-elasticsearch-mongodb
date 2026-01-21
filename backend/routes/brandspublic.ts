import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicCatalogService } from "@app/core/dependencies";

const router = Router();

router.route("/").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getBrands();
    res.json(data);
  })
);

router.route("/search").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicCatalogService();
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const data = await service.searchBrands(query);
    res.json(data);
  })
);

export default router;
