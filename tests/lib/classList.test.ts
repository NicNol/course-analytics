import { describe, expect, it } from "vitest";
import { classList, findListedCourse } from "../../lib/classList";

const DIVISION_TAGS = ["Lower Division", "Upper Division"];
const REQUIREMENT_TAGS = ["Core Class", "Elective"];
const FIRST_UPPER_DIVISION_NUMBER = 300;

function divisionTagFor(code: string) {
  const courseNumber = Number(code.split(" ")[1]);
  return courseNumber < FIRST_UPPER_DIVISION_NUMBER ? "Lower Division" : "Upper Division";
}

describe("classList", () => {
  it("has no duplicate course codes", () => {
    const codes = classList.map(({ code }) => code);
    const uniqueCodes = new Set(codes);

    expect(uniqueCodes.size).toBe(codes.length);
  });

  it.each(classList)("$code has the division tag for its course number and one requirement tag", ({ code, tags }) => {
    const divisionTags = tags.filter((tag) => DIVISION_TAGS.includes(tag));
    const requirementTags = tags.filter((tag) => REQUIREMENT_TAGS.includes(tag));

    expect(tags).toHaveLength(2);
    expect(divisionTags).toStrictEqual([divisionTagFor(code)]);
    expect(requirementTags).toHaveLength(1);
  });
});

describe("findListedCourse", () => {
  it("returns the class list entry when the survey name matches its code and title", () => {
    const course = findListedCourse("CS 261 - Data Structures");

    expect(course).toStrictEqual({ code: "CS 261", title: "Data Structures", tags: ["Lower Division", "Core Class"] });
  });

  it.each([
    [
      "the survey shortens the title",
      "CS 274 - Intro to Systems Programming",
      "CS 274",
      "Introduction to Systems Programming",
    ],
    [
      "the survey has no space before the dash",
      "CS 381- Programming Language Fundamentals",
      "CS 381",
      "Programming Language Fundamentals",
    ],
    [
      "the course is outside CS",
      "MTH 231 - Elements of Discrete Mathematics",
      "MTH 231",
      "Elements of Discrete Mathematics",
    ],
  ])("returns the class list code and title when %s", (_scenario, surveyCourseName, expectedCode, expectedTitle) => {
    const course = findListedCourse(surveyCourseName);

    expect(course?.code).toBe(expectedCode);
    expect(course?.title).toBe(expectedTitle);
  });

  it.each([
    ["CS 344 - Operating Systems", "CS 374"],
    ["CS 419 - Software Projects", "CS 467"],
    ["CS 419 (Legacy)/467 - Capstone", "CS 467"],
    ["CS 419/467 - Software Projects", "CS 467"],
  ])("returns the renumbered course when the survey name is %s", (surveyCourseName, expectedCode) => {
    const course = findListedCourse(surveyCourseName);

    expect(course?.code).toBe(expectedCode);
  });

  it.each([
    ["CS 165 - Intro to Computer Science (Accelerated)"],
    ["CS 199 - Companion Course"],
    ["CS 496 - Mobile and Cloud Software Development"],
  ])("returns undefined when the survey name %j is not a listed course", (surveyCourseName) => {
    const course = findListedCourse(surveyCourseName);

    expect(course).toBeUndefined();
  });
});
