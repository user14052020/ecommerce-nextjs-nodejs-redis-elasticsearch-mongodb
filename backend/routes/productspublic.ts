import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getPublicProductsService } from "@app/core/dependencies";

const router = Router();

router.route("/all").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getPublicProductsService();
    const data = await service.listAllActive();
    res.json(data);
  })
);

router.route("/:seo").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicProductsService();
    const data = await service.getBySeo(req.params.seo);
    res.json(data);
  })
);

router.route("/home").post(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicProductsService();
    const data = await service.listHome(req.body);
    res.json(data);
  })
);

router.route("/").post(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getPublicProductsService();
    const data = await service.search(req.body);
    res.json(data);
  })
);

export default router;
