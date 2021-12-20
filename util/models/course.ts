import { Schema, model, Model, models } from "mongoose";

interface ICourse {
    name: string;
    difficulty: string;
    "time commitment": string;
    review: string;
    "review date": string;
    quarter: string;
    "other courses": string[];
}

const schema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
        },
        "time commitment": {
            type: String,
            required: true,
        },
        review: {
            type: String,
            required: function () {
                return typeof this === "string";
            },
        },
        "review date": {
            type: String,
            required: true,
        },
        quarter: {
            type: String,
            required: true,
        },
        "other courses": {
            type: [String],
            required: true,
        },
    },
    { collection: "course-data", versionKey: false, _id: false }
);

const Course: Model<ICourse> =
    models.Course || model<ICourse>("Course", schema);

export { Course };
export type { ICourse };
