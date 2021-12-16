import { prepareSheet, getJSON } from "./helper/sheets"
import summarizeData from "./helper/summarize"

export default async function updateDB() {
    await prepareSheet();
    await getJSON();
    await summarizeData();
}

updateDB();