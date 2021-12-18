import { prepareSheet, getJSON } from "./helper/sheets";
import { summarizeData, emptyDB, saveCourses } from "./helper/summarize";

export default async function updateDB() {
    await prepareSheet();
    const json = await getJSON();
    await console.log(json[0]);
    await emptyDB();
    await saveCourses(json);
    await summarizeData();
}

updateDB();
