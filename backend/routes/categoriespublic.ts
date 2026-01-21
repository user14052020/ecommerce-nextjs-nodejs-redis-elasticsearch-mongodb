import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicCatalogService } from "@app/core/dependencies";

const router = Router();

router.route("/search").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicCatalogService();
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const data = await service.searchCategories(query);
    res.json(data);
  })
);

router.route("/:id").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getCategories(req.params.id);
    res.json(data);
  })
);

export default router;
