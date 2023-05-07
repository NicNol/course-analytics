import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
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

export async function prepareSheet(): Promise<void> {
  try {
    /* Load our duplicate Workbook */
    const newSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Delete all but the first worksheet */
    newSpreadsheet.sheetsByIndex.forEach(async (sheet) => await sheet.delete());

    /* Load the course reviews source Workbook */
    const originalSpreadsheet = await loadSpreadsheet(SURVEY_SPREADSHEET_ID);

    /* Copy original data to newSpreadsheet */
    await originalSpreadsheet.sheetsByIndex[0].copyToSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Reload newSpreadsheet data to prevent errors */
    await newSpreadsheet.loadInfo();
    const newSheet: GoogleSpreadsheetWorksheet = newSpreadsheet.sheetsByIndex[0];

    /* Update newSheet headers to remove duplicates from original */
    await newSheet.setHeaderRow(HEADER_ROW);
  } catch (err) {
    throw err;
  }
}

export async function getJSON(): Promise<ICourse[]> {
  try {
    /* Load our duplicate spreadsheet */
    const newSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Declare and initialize variables */
    const worksheet = newSpreadsheet.sheetsByIndex[0];
    const rows = await worksheet.getRows();
    const output = [];

    /* Create objects from each row of the spreadsheet */
    for (const row of rows) {
      /* All rows have at least one course review */
      let courses = 1;
      const firstCourse = formatCourseName(row.course1);
      const courseNames = [firstCourse];

      /* Check for second course review */
      if (row.secondBool === "Yes") {
        const secondCourse = formatCourseName(row.course2);
        courseNames.push(secondCourse);
        courses += 1;
      }

      /* Check for third course review */
      if (row.thirdBool === "Yes") {
        const thirdCourse = formatCourseName(row.course3);
        courseNames.push(thirdCourse);
        courses += 1;
      }

      /* Create an ICourse object for each review in the spreadsheet row*/
      for (let i = 1; i <= courses; i++) {
        const formattedName = formatCourseName(row[`course${i}`]);
        const course: ICourse = {
          name: formattedName,
          difficulty: row[`difficulty${i}`],
          "time commitment": row[`time${i}`],
          review: row[`tips${i}`],
          "review date": row.timestamp,
          quarter: row.when1,
          "other courses": courseNames.filter((courseName) => courseName !== formattedName),
        };

        /* Push the ICourse object to the output array */
        output.push(course);
      }
    }
    return output;
  } catch (err) {
    throw err;
  }
}
