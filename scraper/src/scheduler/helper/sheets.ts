import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ICourse } from "../../models/course";
import { formatCourseName } from "./summarize";
import { JWT } from "google-auth-library";

type SurveyRow = {
  timestamp: string;
  course1: string;
  difficulty1: string;
  time1: string;
  tips1: string;
  when1: string;
  secondBool: string;
  course2: string;
  difficulty2: string;
  time2: string;
  tips2: string;
  thirdBool: string;
  course3: string;
  difficulty3: string;
  time3: string;
  tips3: string;
};

/* Get credentials from process.env */
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
const googleJWT = new JWT({
  email: GOOGLE_CLIENT_EMAIL || "GOOGLE_CLIENT_EMAIL is missing",
  key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "GOOGLE_PRIVATE_KEY is missing",
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
});

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

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function loadSpreadsheet(id: string): Promise<GoogleSpreadsheet> {
  try {
    const spreadsheet = new GoogleSpreadsheet(id, googleJWT);
    await spreadsheet.loadInfo();
    return spreadsheet;
  } catch (err) {
    throw err;
  }
}

export async function prepareSheet(): Promise<void> {
  try {
    /* Load the course reviews source Workbook */
    const originalSpreadsheet = await loadSpreadsheet(SURVEY_SPREADSHEET_ID);

    /* Copy original data to masterSpreadsheet */
    await originalSpreadsheet.sheetsByIndex[0].copyToSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Reload masterSpreadsheet data to prevent errors */
    const masterSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);
    const newSheetIndex = masterSpreadsheet.sheetCount - 1;
    const newSheet: GoogleSpreadsheetWorksheet = masterSpreadsheet.sheetsByIndex[newSheetIndex];
    const newSheetId = newSheet.sheetId;

    /* Update newSheet headers to remove duplicates from original */
    await newSheet.setHeaderRow(HEADER_ROW);

    /* Rename newSheet */
    const spreadsheetTitle = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    newSheet.updateProperties({ title: spreadsheetTitle });

    /* Delete all but the last worksheet */
    Object.values(masterSpreadsheet.sheetsById).forEach(async (sheet) => {
      if (sheet.sheetId !== newSheetId) await sheet.delete();
    });
  } catch (err) {
    throw err;
  }
}

export async function getJSON(): Promise<ICourse[]> {
  try {
    /* Add sleep to prevent race condition with deleted spreadsheets */
    await sleep(2000);

    /* Load our duplicate spreadsheet */
    const newSpreadsheet = await loadSpreadsheet(MASTER_SPREADSHEET_ID);

    /* Declare and initialize variables */
    const worksheet = newSpreadsheet.sheetsByIndex[0];
    const rows = await worksheet.getRows<SurveyRow>();
    const output = [];

    /* Create objects from each row of the spreadsheet */
    for (const row of rows) {
      /* All rows have at least one course review */
      let courses = 1;
      const firstCourse = formatCourseName(row.get("course1"));
      const courseNames = [firstCourse];

      /* Check for second course review */
      if (row.get("secondBool") === "Yes") {
        const secondCourse = formatCourseName(row.get("course2"));
        courseNames.push(secondCourse);
        courses += 1;
      }

      /* Check for third course review */
      if (row.get("thirdBool") === "Yes") {
        const thirdCourse = formatCourseName(row.get("course3"));
        courseNames.push(thirdCourse);
        courses += 1;
      }

      /* Create an ICourse object for each review in the spreadsheet row*/
      for (let i = 1; i <= courses; i++) {
        const formattedName = formatCourseName(row.get(`course${i}` as keyof SurveyRow));
        const course: ICourse = {
          name: formattedName,
          difficulty: row.get(`difficulty${i}` as keyof SurveyRow),
          "time commitment": row.get(`time${i}` as keyof SurveyRow),
          review: row.get(`tips${i}` as keyof SurveyRow),
          "review date": row.get("timestamp"),
          quarter: row.get("when1"),
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
