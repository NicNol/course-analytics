import { connectToDatabase } from "./mongodb";
import { Summary } from "./models/summary";

export async function getSummary() {
  await connectToDatabase();
  const summary = await Summary.find({}, { _id: false, versionKey: false });
  return summary;
}
