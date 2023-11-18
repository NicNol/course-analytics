import { Course, ICourse } from "../../models/course.js";
import { ISummary, ISummaryByDate, Summary } from "../../models/summary.js";
import { classList } from "../../classList.js";

interface TimeAvg {
  [key: string]: number;
}

interface CourseCodes {
  [key: string]: SummaryObject;
}

const timeAvg: TimeAvg = {
  "0-5 hours": 3,
  "6-12 hours": 9,
  "13-18 hours": 15,
  "18+ hours": 21,
};

class SummaryObject {
  code: string;
  title: string;
  difficulty: number = 0;
  time: number = 0;
  reviews: number = 0;
  tags: [] | string[] = [];

  constructor(code: string, title: string) {
    this.code = code;
    this.title = title;
    this.tags = classList.find((classObj) => classObj.code === code)?.tags || [];
  }
}

export async function saveCourses(json: ICourse[]) {
  const formattedJson = formatCourseData(json);
  await Course.deleteMany({});
  await Course.insertMany(formattedJson);
  const summaryData = {
    "All Time": filterAndSummarizeDataByDate(formattedJson, 99999),
    "Past 2 Years": filterAndSummarizeDataByDate(formattedJson, 730),
    "Past 6 Months": filterAndSummarizeDataByDate(formattedJson, 183),
  };
  await saveSummaryData(summaryData);
}

function filterAndSummarizeDataByDate(json: ICourse[], daysInPast: number): ISummary[] {
  /* Declare and initialize variables */
  const courseCodes: CourseCodes = {};
  const summaryJSON: ISummary[] = [];

  /* Create course summary objects and sum the data from each review */
  for (const course of json) {
    /* Destructure course data */
    const { difficulty, code, title, "time commitment": time, "review date": reviewDate } = course;
    if (!code || !title) continue;

    /* Add course name to list of possible course names if it doesn't exist yet */
    if (!courseCodes.hasOwnProperty(code)) {
      courseCodes[code] = new SummaryObject(code, title);
    }

    /* Ignore reviews that are older than daysInPast */
    if (Date.parse(reviewDate) <= new Date().getTime() - daysInPast * 1000 * 60 * 60 * 24) continue;

    /* Add review details to course totals */
    courseCodes[code].reviews += 1;
    courseCodes[code].difficulty += parseInt(difficulty);
    courseCodes[code].time += timeAvg[time];
  }

  /* Average difficulty and time commitment data */
  for (const course in courseCodes) {
    /* Destructure course totals */
    const { difficulty, code, title, reviews, tags, time } = courseCodes[course];

    /* Round difficulty to one decimal */
    const avgDifficulty = Math.round((difficulty / reviews) * 10) / 10 || 0;

    /* Round the time commitment to an integer */
    const timeCommitment = Math.round(time / reviews) || 0;

    /* Create a new summary document */
    const courseSummary: ISummary = {
      code: code,
      title: title,
      "average difficulty": avgDifficulty.toString(),
      "time commitment": timeCommitment.toString(),
      "review count": reviews.toString(),
      tags: tags,
    };

    /* Push the final summary to the summaryJSON array */
    summaryJSON.push(courseSummary);
  }

  return summaryJSON;
}

async function saveSummaryData(summaryJSON: ISummaryByDate) {
  try {
    /* Update the summary document -or- Insert if not found */
    await Summary.findOneAndUpdate({}, summaryJSON, { upsert: true });
  } catch (err) {
    throw err;
  }
}

export function formatCourseName(courseName: string) {
  /* Course name(s) found in spreadsheet */
  const CS161 = ["CS 161 - Intro to Computer Science I"];
  const CS162 = ["CS 162 - Intro to Computer Science II"];
  const CS344 = ["CS 344 - Operating Systems"];
  const CS372 = ["CS 372 - Intro to Computer Networks"];
  const CS391 = ["CS 391 - Social and Ethical Issues in CS"];
  const CS450 = ["CS 450 - Intro to Computer Graphics"];
  const CS467 = ["CS 419 - Software Projects", "CS 419 (Legacy)/467 - Capstone", "CS 419/467 - Software Projects"];
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
    const [code, title] = splitNameIntoCodeAndTitle(course?.name);
    course.code = code;
    course.title = title;
    delete course.name;
  }

  return formattedJson;
}

function splitNameIntoCodeAndTitle(name?: string) {
  if (!name) return ["", ""];
  const correctedName = formatCourseName(name);
  const nameArray = correctedName.split(" ");
  const code = `${nameArray[0]} ${nameArray[1]}`;
  const title = nameArray.slice(3).join(" "); // Remove "CS ### -" part of string
  return [code, title];
}
