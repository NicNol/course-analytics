import { prepareSheet, getJSON } from "../helper/sheets";
import { saveCourses } from "../helper/summarize";
import { connectToDatabase, disconnectFromDatabase } from "../../mongodb";

export default async function updateDB() {
  try {
    await connectToDatabase();
    await prepareSheet();
    const json = await getJSON();
    await saveCourses(json);
  } catch (err) {
    console.error(err);
  } finally {
    await disconnectFromDatabase();
  }
}
