import { Schema, model, Model, models } from "mongoose";

interface ISummary {
    name: string;
    "average difficulty": string;
    "time commitment": string;
    "review count": string;
}

const schema = new Schema<ISummary>(
    {
        name: {
            type: String,
            required: true,
        },
        "average difficulty": {
            type: String,
            required: true,
        },
        "time commitment": {
            type: String,
            required: true,
        },
        "review count": {
            type: String,
            required: true,
        },
    },
    { collection: "summary-data" }
);

const Summary: Model<ISummary> =
    models.Summary || model<ISummary>("Summary", schema);

export { Summary };
export type { ISummary };
