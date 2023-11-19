import { Router } from "express";
import updateDB from "../../scheduler/updateDB/index.js";

const router = Router();

/* '/' ROUTES *****************************************************************/

router.get("/", async (req, res) => {
  if (req.headers.authorization !== process.env.CRON_KEY) {
    res.status(401).end("UNAUTHORIZED");
    return;
  }

  res.status(200).json({ message: "Started Scraping Process" });
  try {
    await updateDB();
  } catch (err) {
    console.error(err);
  }
});

export default router;
