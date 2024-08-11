import { prepareSheet, getJSON } from "../helper/sheets.js";
import { saveCourses } from "../helper/summarize.js";
import { connectToDatabase, disconnectFromDatabase } from "../../mongodb.js";

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
