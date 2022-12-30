import { Router } from "express";

const router = Router();

/* '/' ROUTES *****************************************************************/

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

export default router;
