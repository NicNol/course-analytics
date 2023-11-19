import { Router } from "express";
import scrapeRoutes from "./controllers/scrape.js";

const router = Router();

router.use("/api/scrape", scrapeRoutes);

export default router;
