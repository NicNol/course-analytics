import { getNewSurveyResponsesAsRows, convertRowsToJSON, getMasterRows } from "./helper/sheets";
import { upsertNewCourses, updateCourseSummary } from "./helper/summarize";

export default async function updateDB() {
  try {
    /* Handle Invidual Course Data */
    const newRows = await getNewSurveyResponsesAsRows();
    const newRowJSON = convertRowsToJSON(newRows);
    await upsertNewCourses(newRowJSON);

    /* Summarize Course Data */
    const masterRows = await getMasterRows();
    const masterDataJSON = convertRowsToJSON(masterRows);
    await updateCourseSummary(masterDataJSON);
  } catch (err) {
    throw err;
  }
}

updateDB();
