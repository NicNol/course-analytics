import mongoose from "mongoose";
const Schema = mongoose.Schema;

const course = new Schema({
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

mongoose.models = {};

const Course = mongoose.model("User", course);

export default Course;
