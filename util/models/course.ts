import { Schema, model } from "mongoose";

export interface CourseSchema {
    name: string;
    difficulty: string;
    "time commitment": string;
    review: string;
    "review date": string;
    quarter: string;
}

const schema = new Schema<CourseSchema>({
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
        required: true,
    },
    "review date": {
        type: String,
        required: true,
    },
    quarter: {
        type: String,
        required: true,
    },
});

const Course = model<CourseSchema>("Course", schema);

export default Course;
