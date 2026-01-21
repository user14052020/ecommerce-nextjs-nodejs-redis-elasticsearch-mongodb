import { Router, Request, Response } from "express";
import { seedDatabaseIfNeeded } from "@app/seed/seedDatabase";

const router = Router();

router.route("/").get(async (_req: Request, res: Response) => {
  try {
    const result = await seedDatabaseIfNeeded();
    res.json({
      message: result.seeded ? "seeded" : "skipped",
      reason: "reason" in result ? result.reason : null,
    });
  } catch (error) {
    res.status(500).json({ message: "seed failed" });
  }
});

export default router;
