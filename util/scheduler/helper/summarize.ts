import { connectToDatabase, disconnectFromDatabase } from "../../mongodb";
import { Course, ICourse } from "../../models/course";
import { ISummary, Summary } from "../../models/summary";
import { classList } from "../../../classList";

interface TimeAvg {
    [key: string]: number;
}

interface CourseNames {
    [key: string]: SummaryObject;
}

interface TagsMap {
    [key: string]: [] | string[];
}

const tagsMap: TagsMap = {};
for (const course of classList) {
    const { number, tags } = course;
    tagsMap[number] = tags;
}

const timeAvg: TimeAvg = {
    "0-5 hours": 3,
    "6-12 hours": 9,
    "13-18 hours": 15,
    "18+ hours": 21,
};

class SummaryObject {
    name: string;
    difficulty: number = 0;
    time: number = 0;
    reviews: number = 0;
    tags: [] | string[] = [];

    constructor(name: string, tags: string[]) {
        this.name = name;
        this.tags = tags;
    }
}

async function emptyDB() {
    await connectToDatabase();
    await Course.deleteMany({});
    await Summary.deleteMany({});
}

async function saveCourses(json: ICourse[]) {
    await connectToDatabase();
    await Course.insertMany(json);
    await summarizeData(json);
    await disconnectFromDatabase();
}

async function summarizeData(json: ICourse[]) {
    /* Summarize data in each course in the classList */

    const courseNames: CourseNames = {};
    const summaryJSON: ISummary[] = [];

    /* Get Course Names (keys) */
    for (const course of json) {
        const { difficulty, name, "time commitment": time } = course;
        if (!courseNames.hasOwnProperty(name)) {
            const name_array = name.split(" ");
            const key = `${name_array[0]} ${name_array[1]}`;
            const tags = tagsMap[key];
            courseNames[name] = new SummaryObject(name, tags);
        }
        courseNames[name].reviews++;
        courseNames[name].difficulty += parseInt(difficulty);
        courseNames[name].time += timeAvg[time];
    }

    /* Average difficulty and time commitment data */
    for (const course in courseNames) {
        const { difficulty, name, reviews, tags, time } = courseNames[course];
        /* Round difficulty to one decimal */
        const avgDifficulty = Math.round((difficulty / reviews) * 10) / 10;

        const timeCommitment = Math.round(time / reviews);

        /* Create a new summary document */
        let courseSummary: ISummary = {
            name: name,
            "average difficulty": avgDifficulty.toString(),
            "time commitment": timeCommitment.toString(),
            "review count": reviews.toString(),
            tags: tags,
        };
        summaryJSON.push(courseSummary);
    }

    try {
        /* Update the summary document -or- Insert if not found */
        await Summary.insertMany(summaryJSON);
    } catch (err) {
        console.error(err);
    }
}

export { summarizeData, emptyDB, saveCourses };
