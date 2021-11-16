import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../util/mongodb";
import Course from "../../../util/models/course";

type Data = {
    name: string;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    getDocuments();
    res.status(200).json({ name: "John Doe" });
}

const { GoogleSpreadsheet } = require("google-spreadsheet");

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

const originalSpreadsheet = new GoogleSpreadsheet(
    "1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU"
);
//const newSpreadsheet = new GoogleSpreadsheet("");

async function getDocuments() {
    try {
        await originalSpreadsheet.useServiceAccountAuth({
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        });

        await originalSpreadsheet.loadInfo(); // loads document properties and worksheets
        console.log(originalSpreadsheet.title);
    } catch (e) {
        console.error(e);
    }
}

//export default connectDB(handler);
export default handler;
