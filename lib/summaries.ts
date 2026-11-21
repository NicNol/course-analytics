import { connectToDatabase } from "../scraper/src/mongodb";
import { Summary } from "../scraper/src/models/summary";

export async function getSummary() {
  await connectToDatabase();
  const summary = await Summary.find({}, { _id: false, versionKey: false });
  return summary;
}
