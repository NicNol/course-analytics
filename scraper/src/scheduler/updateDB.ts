import { convertRowsToJSON, copyRowsToMasterSheet, getMasterRows, getNewSurveyResponsesAsRows } from "./helper/sheets";
import { updateCourseSummary, upsertNewCourses } from "./helper/summarize";
import { connectToDatabase, disconnectFromDatabase } from "../mongodb";

export default async function updateDB() {
  try {
    connectToDatabase();

    /* Handle Invidual Course Data */
    const newRows = await getNewSurveyResponsesAsRows();
    const newRowJSON = convertRowsToJSON(newRows);
    await upsertNewCourses(newRowJSON);
    await copyRowsToMasterSheet(newRows);

    /* Summarize Course Data */
    const masterRows = await getMasterRows();
    const masterDataJSON = convertRowsToJSON(masterRows);
    await updateCourseSummary(masterDataJSON);

    await disconnectFromDatabase();
  } catch (err) {
    console.error(err);
  }
}

updateDB();
