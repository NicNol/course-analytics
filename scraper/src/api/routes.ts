import { Router } from "express";
import scrapeRoutes from "./controllers/scrape";

const router = Router();

router.use("/api/scrape", scrapeRoutes);

export default router;
