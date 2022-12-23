import { createScheduledFunction } from "inngest";
import updateDB from "../../util/scheduler/updateDB";
import { serve } from "inngest/next";

const scrape = createScheduledFunction(
  "Scrape Google Sheets", // The name of your function, used for observability.
  "16 * * * *", // The cron syntax for the function
  updateDB // The function code, defined above.
);

export default serve("Scrape Google Sheets", [scrape]);
