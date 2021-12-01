import { connectToDatabase } from "./mongodb";
import { Course } from "./models/course";
import { ISummary, Summary } from "./models/summary";
import { classList } from "../classList";

interface TimeAvg {
    "0-5 hours": Number;
    "6-12 hours": Number;
    "13-18 hours": Number;
    "18+ hours": Number;
}

const timeAvg: TimeAvg = {
    "0-5 hours": 3,
    "6-12 hours": 9,
    "13-18 hours": 15,
    "18+ hours": 21,
};

async function summarizeData() {
    /* Summarize data in each course in the classList */
    for (const classObj of classList) {
        let courseNumber = classObj.number;
        let totalTime = 0;
        let totalDifficulty = 0;
        let courseName: string;

        try {
            await connectToDatabase();
            const courses = await Course.find({
                name: { $regex: courseNumber, $options: "i" },
            });
            /* If no course data is found for some reason, skip to the next course */
            if (!courses.length) {
                continue;
            }

            /* Tally difficulty and time commitment data */
            for (const course of courses) {
                totalDifficulty += parseInt(course.difficulty);
                const timeCommitted = course["time commitment"];
                let time = parseInt((timeAvg as any)[timeCommitted]);
                totalTime += time;
            }

            /* Round difficulty to one decimal */
            let avgDifficulty =
                Math.round((totalDifficulty / courses.length) * 10) / 10;

            let timeCommitment = Math.round(totalTime / courses.length);

            /* Create a new summary document */
            let output: ISummary = {
                name: courses[0].name,
                "average difficulty": avgDifficulty.toString(),
                "time commitment": timeCommitment.toString(),
                "review count": courses.length.toString(),
            };

            /* Update the summary document -or- Insert if not found */
            await Summary.findOneAndUpdate({ name: courses[0].name }, output, {
                upsert: true,
            });
        } catch (err) {
            console.error(err);
        }
    }
}

export default summarizeData;
