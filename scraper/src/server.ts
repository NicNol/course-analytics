import express, { Application } from "express";
import routes from "./api/routes.js";
import { config } from "dotenv";

config();
const app: Application = express();

app.enable("trust proxy");
// `extended` must stay explicit: express 5's built-in urlencoded defaults it to false.
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/", routes);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
