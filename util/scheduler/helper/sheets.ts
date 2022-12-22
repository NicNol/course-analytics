import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ICourse } from "../../models/course";
import { formatCourseName } from "./summarize";

/* Get credentials from process.env */
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
const AUTH_CREDENTIALS = {
  client_email: GOOGLE_CLIENT_EMAIL || "GOOGLE_CLIENT_EMAIL is missing",
  private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "GOOGLE_PRIVATE_KEY is missing",
};

/* Declare and initialize spreadsheet objects */
const SURVEY_SPREADSHEET_ID = "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU";
const MASTER_SPREADSHEET_ID = "1NEIcb6ab5HTeR_fEurwRIRbnXjb8upCb_yB0FVR7X58";
const HEADER_ROW = [
  "timestamp",
  "course1",
  "difficulty1",
  "time1",
  "tips1",
  "when1",
  "secondBool",
  "course2",
  "difficulty2",
  "time2",
  "tips2",
  "thirdBool",
  "course3",
  "difficulty3",
  "time3",
  "tips3",
];

async function loadSpreadsheet(id: string): Promise<GoogleSpreadsheet> {
  try {
    const spreadsheet = new GoogleSpreadsheet(id);
    await spreadsheet.useServiceAccountAuth(AUTH_CREDENTIALS);
    await spreadsheet.loadInfo();
    return spreadsheet;
  } catch (err) {
    throw err;
  }
}

async function getNewSurveyResponsesAsRows(): Promise<GoogleSpreadsheetRow[]> {
  try {
    /* Load the survey spreadsheet with our raw data */
    const surveySpreadsheet = await loadSpreadsheet(SURVEY_SPREADSHEET_ID);
    const rawResultsSheet = surveySpreadsheet.sheetsByIndex[0];

    /* Load our version of the spreadsheet */
    const masterSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);
    const masterSheets = masterSpreadsheet.sheetsByIndex;
    const masterResultsSheet = masterSheets[0];
    await prepareMasterSpreadsheetIfNeeded(masterSpreadsheet);
    const masterRowCount = (await masterResultsSheet.getRows()).length;

    /* Delete all but the first worksheet */
    for (let i = masterSheets.length - 1; i > 0; i--) {
      await masterSheets[i].delete();
    }

    /* Copy raw survey data to our master spreadsheet */
    await rawResultsSheet.copyToSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Update temp sheet headers to remove duplicate column names from original */
    const tempResultsSheet = masterSheets[1];
    await tempResultsSheet.setHeaderRow(HEADER_ROW);

    /* Get rows that aren't in our master spreadSheet */
    return await tempResultsSheet.getRows({ offset: masterRowCount, limit: 9999 });
  } catch (err) {
    throw err;
  }
}

async function getMasterRows(): Promise<GoogleSpreadsheetRow[]> {
  /* Load our master spreadsheet */
  const masterSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);
  await prepareMasterSpreadsheetIfNeeded(masterSpreadsheet);
  const masterResultsSheet = masterSpreadsheet.sheetsByIndex[0];
  return await masterResultsSheet.getRows();
}

async function prepareMasterSpreadsheetIfNeeded(spreadsheet: GoogleSpreadsheet) {
  const [master] = spreadsheet.sheetsByIndex;
  if (!master.headerValues) await master.setHeaderRow(HEADER_ROW);
}

async function copyRowsToSheet(rows: GoogleSpreadsheetRow[], sheet: GoogleSpreadsheetWorksheet) {
  for (const row of rows) {
    await sheet.addRow(row);
    await sleep(1000); // prevent rate limiting since we're adding rows one by one
  }
}

function convertRowsToJSON(rows: GoogleSpreadsheetRow[]): ICourse[] {
  const output: ICourse[] = [];

  /* Create objects from each row of the spreadsheet */
  for (const row of rows) {
    /* All rows have at least one course review */
    const formattedCourseNames = [formatCourseName(row.course1)];

    /* Check for additional course reviews */
    if (row.secondBool === "Yes") formattedCourseNames.push(formatCourseName(row.course2));
    if (row.thirdBool === "Yes") formattedCourseNames.push(formatCourseName(row.course3));

    /* Create an ICourse object for each review in the spreadsheet row*/
    formattedCourseNames.forEach((name, i) => {
      output.push({
        name: name,
        difficulty: row[`difficulty${i + 1}`],
        "time commitment": row[`time${i + 1}`],
        review: row[`tips${i + 1}`],
        "review date": row.timestamp,
        quarter: row.when1,
        "other courses": formattedCourseNames.filter((courseName) => courseName !== name),
      });
    });
  }

  return output;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { getNewSurveyResponsesAsRows, convertRowsToJSON, copyRowsToSheet, sleep, getMasterRows };
