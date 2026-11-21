import updateDB from "./index.js";

updateDB().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
