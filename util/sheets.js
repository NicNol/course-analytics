const { GoogleSpreadsheet } = require("google-spreadsheet");

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

console.log(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);

const doc = new GoogleSpreadsheet(
    "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU"
);

async function getDocuments() {
    try {
        await doc.useServiceAccountAuth({
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY,
        });

        await doc.loadInfo(); // loads document properties and worksheets
        console.log(doc.title);
    } catch (e) {
        console.error(e);
    }
}

//getDocuments();
