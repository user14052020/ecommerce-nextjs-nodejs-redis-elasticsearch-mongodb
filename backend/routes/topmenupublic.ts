import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicCatalogService } from "@app/core/dependencies";

const router = Router();

router.route("/:id").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicCatalogService();
    const data = await service.getTopmenu(req.params.id);
    res.json(data);
  })
);

export default router;
