const { GoogleSpreadsheet } = require("google-spreadsheet");
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ICourse } from "../../models/course";
import { formatCourseName } from "./summarize";

/* Get credentials from process.env */
const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
const authCredentials = {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

/* Declare and initialize spreadsheet objects */
const originalSpreadsheetID = "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU";
const originalSpreadsheet = new GoogleSpreadsheet(originalSpreadsheetID);
const newSpreadsheetID = "1NEIcb6ab5HTeR_fEurwRIRbnXjb8upCb_yB0FVR7X58";
const newSpreadsheet = new GoogleSpreadsheet(newSpreadsheetID);

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

async function getJSON(): Promise<ICourse[]> {
    try {
        /* Load our duplicate spreadsheet */
        await newSpreadsheet.useServiceAccountAuth(authCredentials);
        await newSpreadsheet.loadInfo();

        /* Declare and initialize variables */
        const worksheet = newSpreadsheet.sheetsByIndex[1];
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
                courses++;
            }

            /* Check for third course review */
            if (row.thirdBool === "Yes") {
                const thirdCourse = formatCourseName(row.course3);
                courseNames.push(thirdCourse);
                courses++;
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
                    "other courses": courseNames.filter(
                        (courseName) => courseName !== formattedName
                    ),
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

export { prepareSheet, getJSON };
