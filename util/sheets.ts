const { GoogleSpreadsheet } = require("google-spreadsheet");

const { WorksheetType } = require("@types/google-spreadsheet");

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

const originalSpreadsheetID = "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU";
const originalSpreadsheet = new GoogleSpreadsheet(originalSpreadsheetID);
const newSpreadsheetID = "1NEIcb6ab5HTeR_fEurwRIRbnXjb8upCb_yB0FVR7X58";
const newSpreadsheet = new GoogleSpreadsheet(newSpreadsheetID);
const authCredentials = {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

async function getJSON(worksheet: typeof WorksheetType) {
    try {
        const rows = await worksheet.getRows();
        const rowsCount = rows.length;

        for (let row = 0; row < rowsCount; row++) {}
    } catch (e) {
        console.error(e);
    }
}

async function prepareSheet() {
    try {
        await newSpreadsheet.useServiceAccountAuth(authCredentials);
        await originalSpreadsheet.useServiceAccountAuth(authCredentials);
        await newSpreadsheet.loadInfo();
        await originalSpreadsheet.loadInfo();

        /* Delete old spreadsheet */
        const oldSheet = newSpreadsheet.sheetsByIndex[1];
        if (oldSheet) {
            oldSheet.delete();
        }

        /* Copy original data to newSpreadsheet */
        originalSpreadsheet.sheetsByIndex[0]
            .copyToSpreadsheet(newSpreadsheetID)
            .then(async () => {
                /* Reload newSpreadsheet data to prevent errors */
                await newSpreadsheet.loadInfo();
                let newSheet = newSpreadsheet.sheetsByIndex[1];

                /* Update newSheet headers to remove duplicates from original */
                newSheet.setHeaderRow([
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

                return newSheet;
            });
    } catch (e) {
        console.error(e);
    }
}

export {};
