import express, { Application } from "express";
import bodyParser from "body-parser";
import routes from "./api/routes";
import { config } from "dotenv";

config();
const { json, urlencoded } = bodyParser;
const app: Application = express();

app.enable("trust proxy");
app.use(urlencoded({ extended: true }));

app.use(json());
app.use("/", routes);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
