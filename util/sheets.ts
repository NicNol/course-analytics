const { GoogleSpreadsheet } = require("google-spreadsheet");
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { CourseSchema } from "./models/course";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

const originalSpreadsheetID = "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU";
const originalSpreadsheet = new GoogleSpreadsheet(originalSpreadsheetID);
const newSpreadsheetID = "1NEIcb6ab5HTeR_fEurwRIRbnXjb8upCb_yB0FVR7X58";
const newSpreadsheet = new GoogleSpreadsheet(newSpreadsheetID);
const authCredentials = {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

async function getJSON(): Promise<Array<CourseSchema>> {
    try {
        await newSpreadsheet.useServiceAccountAuth(authCredentials);
        await newSpreadsheet.loadInfo();
        const worksheet = newSpreadsheet.sheetsByIndex[1];

        const rows = await worksheet.getRows();
        let output = [];

        for (const row of rows) {
            let courses = 1;
            let courseNames = [row.course1];
            if (row.secondBool === "Yes") {
                courseNames.push(row.course2);
                courses++;
            }
            if (row.thirdBool === "Yes") {
                courseNames.push(row.course3);
                courses++;
            }
            for (let i = 1; i <= courses; i++) {
                let course: CourseSchema = {
                    name: row[`course${i}`],
                    difficulty: row[`difficulty${i}`],
                    "time commitment": row[`time${i}`],
                    review: row[`tips${i}`],
                    "review date": row.timestamp,
                    quarter: row.when1,
                    "other courses": courseNames.filter(
                        (courseName) => courseName !== row[`course${i}`]
                    ),
                };
                output.push(course);
            }
        }
        return output;
    } catch (err) {
        throw err;
    }
}

async function prepareSheet(): Promise<any> {
    try {
        /* Load our duplicate Workbook */
        await newSpreadsheet.useServiceAccountAuth(authCredentials);
        await newSpreadsheet.loadInfo();

        /* Delete the last spreadsheet */
        const oldSheet = newSpreadsheet.sheetsByIndex[1];
        if (oldSheet) {
            oldSheet.delete();
        }

        /* Load the course reviews source Workbook */
        await originalSpreadsheet.useServiceAccountAuth(authCredentials);
        await originalSpreadsheet.loadInfo();

        /* Copy original data to newSpreadsheet */
        await originalSpreadsheet.sheetsByIndex[0].copyToSpreadsheet(
            newSpreadsheetID
        );

        /* Reload newSpreadsheet data to prevent errors */
        await newSpreadsheet.loadInfo();
        let newSheet: GoogleSpreadsheetWorksheet = await newSpreadsheet
            .sheetsByIndex[1];

        /* Update newSheet headers to remove duplicates from original */
        await newSheet.setHeaderRow([
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
        ]);
    } catch (err) {
        throw err;
    }
}

export { prepareSheet, getJSON };
