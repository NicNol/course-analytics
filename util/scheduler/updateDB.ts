import { prepareSheet, getJSON } from "./helper/sheets";
import { emptyDB, saveCourses } from "./helper/summarize";

export default async function updateDB() {
    await prepareSheet();
    const json = await getJSON();
    await emptyDB();
    await saveCourses(json);
}

updateDB();
