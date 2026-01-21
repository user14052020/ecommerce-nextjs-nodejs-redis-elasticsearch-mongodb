import { Router, Request, Response } from "express";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getTurkeyService } from "@app/core/dependencies";

const router = Router();

router.route("/").get(
  asyncHandler(async (_req, res: Response) => {
    const service = getTurkeyService();
    const data = await service.listTurkey();
    res.json(data);
  })
);

router.route("/:id").get(
  asyncHandler(async (req: Request, res: Response) => {
    const service = getTurkeyService();
    const data = await service.getTurkeyByCity(req.params.id);
    res.json(data);
  })
);

export default router;
