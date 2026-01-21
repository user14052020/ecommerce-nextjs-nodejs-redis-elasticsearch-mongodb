import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getCountryService } from "@app/core/dependencies";

const router = Router();

router.route("/").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getCountryService();
    const data = await service.listCountries();
    res.json(data);
  })
);

router.route("/:id").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getCountryService();
    const data = await service.getCountryByName(req.params.id);
    res.json(data);
  })
);

export default router;
