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
    const formattedJson = formatCourseData(json);
    await connectToDatabase();
    await Course.insertMany(formattedJson);
    await summarizeData(json);
    await disconnectFromDatabase();
}

async function summarizeData(json: ICourse[]) {
    /* Declare and initialize variables */
    const courseNames: CourseNames = {};
    const summaryJSON: ISummary[] = [];

    /* Create course summary objects and sum the data from each review */
    for (const course of json) {
        /* Destructure course data */
        const { difficulty, name, "time commitment": time } = course;

        /* Add course name to list of possible course names if it doesn't exist yet */
        if (!courseNames.hasOwnProperty(name)) {
            const name_array = name.split(" ");
            const key = `${name_array[0]} ${name_array[1]}`;
            const tags = tagsMap[key];
            courseNames[name] = new SummaryObject(name, tags);
        }

        /* Add review details to course totals */
        courseNames[name].reviews++;
        courseNames[name].difficulty += parseInt(difficulty);
        courseNames[name].time += timeAvg[time];
    }

    /* Average difficulty and time commitment data */
    for (const course in courseNames) {
        /* Destructure course totals */
        const { difficulty, name, reviews, tags, time } = courseNames[course];

        /* Round difficulty to one decimal */
        const avgDifficulty = Math.round((difficulty / reviews) * 10) / 10;

        /* Round the time commitment to an integer */
        const timeCommitment = Math.round(time / reviews);

        /* Create a new summary document */
        let courseSummary: ISummary = {
            name: name,
            "average difficulty": avgDifficulty.toString(),
            "time commitment": timeCommitment.toString(),
            "review count": reviews.toString(),
            tags: tags,
        };

        /* Push the final summary to the summaryJSON array */
        summaryJSON.push(courseSummary);
    }

    try {
        /* Update the summary document -or- Insert if not found */
        await Summary.insertMany(summaryJSON);
    } catch (err) {
        console.error(err);
    }
}

function formatCourseName(courseName: string) {
    /* Course name(s) found in spreadsheet */
    const CS161 = ["CS 161 - Intro to Computer Science I"];
    const CS162 = ["CS 162 - Intro to Computer Science II"];
    const CS344 = ["CS 344 - Operating Systems"];
    const CS372 = ["CS 372 - Intro to Computer Networks"];
    const CS391 = ["CS 391 - Social and Ethical Issues in CS"];
    const CS450 = ["CS 450 - Intro to Computer Graphics"];
    const CS467 = [
        "CS 419 - Software Projects",
        "CS 419 (Legacy)/467 - Capstone",
        "CS 419/467 - Software Projects",
    ];
    const CS475 = ["CS 475 - Intro to Parallel Programming"];
    const CS477 = ["CS 477 - Digital Forensics"];

    /* Course name corrections derived from the course catalog */
    if (CS161.includes(courseName)) {
        return "CS 161 - Introduction to Computer Science I";
    }
    if (CS162.includes(courseName)) {
        return "CS 162 - Introduction to Computer Science II";
    }
    if (CS344.includes(courseName)) {
        return "CS 344 - Operating Systems I";
    }
    if (CS372.includes(courseName)) {
        return "CS 372 - Introduction to Computer Networks";
    }
    if (CS391.includes(courseName)) {
        return "CS 391 - Social and Ethical Issues in Computer Science";
    }
    if (CS450.includes(courseName)) {
        return "CS 450 - Introduction to Computer Graphics";
    }
    if (CS467.includes(courseName)) {
        return "CS 467 - Online Capstone Project";
    }
    if (CS475.includes(courseName)) {
        return "CS 475 - Introduction to Parallel Programming";
    }
    if (CS477.includes(courseName)) {
        return "CS 477 - Introduction to Digital Forensics";
    }

    /* Else */
    return courseName;
}

function formatCourseData(json: ICourse[]) {
    /* Create a copy of the JSON data */
    const formattedJson = [...json];

    /* Perform formatting on each course within the JSON data */
    for (const course of formattedJson) {
        /* Format course names to account for inconsistent naming in results */
        course.name = formatCourseName(course.name);
    }

    return formattedJson;
}

export { summarizeData, emptyDB, saveCourses, formatCourseName };
