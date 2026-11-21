import { Course, ICourse } from "../../lib/models/course";
import { timeAvg } from "../../lib/summarize";
import { runInTransaction } from "../../lib/mongodb";

export async function saveCourses(json: ICourse[]) {
  const formattedJson = formatCourseData(json);
  warnAboutUnrecognizedTimeCommitments(formattedJson);
  await runInTransaction(async (session) => {
    await Course.deleteMany({}, { session });
    await Course.insertMany(formattedJson, { session });
  });
}

function warnAboutUnrecognizedTimeCommitments(json: ICourse[]) {
  const unrecognized = new Set(json.map((course) => course["time commitment"]).filter((time) => !timeAvg.has(time)));
  if (unrecognized.size > 0) {
    console.warn(
      `Ignoring unrecognized time commitments: ${[...unrecognized].map((time) => JSON.stringify(time)).join(", ")}`,
    );
  }
}

export function formatCourseName(rawName: string) {
  const courseName = rawName.replace(/^([A-Z]+ \d+)\s*-\s*/, "$1 - ");

  /* Course name(s) found in spreadsheet */
  const CS161 = ["CS 161 - Intro to Computer Science I"];
  const CS162 = ["CS 162 - Intro to Computer Science II"];
  const CS372 = ["CS 372 - Intro to Computer Networks"];
  const CS374 = ["CS 344 - Operating Systems"];
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
  if (CS374.includes(courseName)) {
    return "CS 374 - Operating Systems I";
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
