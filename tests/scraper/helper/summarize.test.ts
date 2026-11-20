import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { classList } from "../../../scraper/src/classList";
import type { ISummaryByDate } from "../../../scraper/src/models/summary";
import { formatCourseName, saveCourses } from "../../../scraper/src/scheduler/helper/summarize";
import { buildSheetReview } from "../../support/fixtures";

const { deleteMany, insertMany, findOneAndUpdate } = vi.hoisted(() => ({
  deleteMany: vi.fn(),
  insertMany: vi.fn(),
  findOneAndUpdate: vi.fn(),
}));

vi.mock("../../../scraper/src/models/course", () => ({ Course: { deleteMany, insertMany } }));
vi.mock("../../../scraper/src/models/summary", () => ({ Summary: { findOneAndUpdate } }));

describe("formatCourseName", () => {
  it("returns the name with a spaced dash when the dash has no space before it", () => {
    const formattedName = formatCourseName("CS 381- Programming Language Fundamentals");

    expect(formattedName).toBe("CS 381 - Programming Language Fundamentals");
  });

  it.each([
    "CS 381 - Programming Language Fundamentals",
    "MTH 231 - Elements of Discrete Mathematics",
    "CS 261 - Data Structures",
    "CS 374 - Operating Systems I",
  ])("returns %j unchanged when it is already well formed", (name) => {
    const formattedName = formatCourseName(name);

    expect(formattedName).toBe(name);
  });

  it("returns the CS 374 name when the sheet still uses the retired CS 344 name", () => {
    const formattedName = formatCourseName("CS 344 - Operating Systems");

    expect(formattedName).toBe("CS 374 - Operating Systems I");
  });

  it.each(["CS 419 - Software Projects", "CS 419 (Legacy)/467 - Capstone", "CS 419/467 - Software Projects"])(
    "returns the CS 467 name when the sheet uses %j",
    (name) => {
      const formattedName = formatCourseName(name);

      expect(formattedName).toBe("CS 467 - Online Capstone Project");
    },
  );

  it.each([
    ["CS 161 - Intro to Computer Science I", "CS 161 - Introduction to Computer Science I"],
    ["CS 162 - Intro to Computer Science II", "CS 162 - Introduction to Computer Science II"],
    ["CS 372 - Intro to Computer Networks", "CS 372 - Introduction to Computer Networks"],
    ["CS 391 - Social and Ethical Issues in CS", "CS 391 - Social and Ethical Issues in Computer Science"],
    ["CS 450 - Intro to Computer Graphics", "CS 450 - Introduction to Computer Graphics"],
    ["CS 475 - Intro to Parallel Programming", "CS 475 - Introduction to Parallel Programming"],
    ["CS 477 - Digital Forensics", "CS 477 - Introduction to Digital Forensics"],
  ])("returns the catalog title when the sheet uses %j", (sheetName, catalogName) => {
    const formattedName = formatCourseName(sheetName);

    expect(formattedName).toBe(catalogName);
  });
});

describe("saveCourses", () => {
  const REVIEW_DATE_WITHIN_SIX_MONTHS = "6/1/2026 10:00:00";
  const REVIEW_DATE_WITHIN_TWO_YEARS = "6/1/2025 10:00:00";
  const REVIEW_DATE_OLDER_THAN_TWO_YEARS = "6/1/2023 10:00:00";

  function readSavedSummary(): ISummaryByDate {
    return findOneAndUpdate.mock.calls[0][1];
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saves averages for each date range when a course has reviews of different ages", async () => {
    const reviews = [
      buildSheetReview({
        difficulty: "5",
        "time commitment": "18+ hours",
        "review date": REVIEW_DATE_OLDER_THAN_TWO_YEARS,
      }),
      buildSheetReview({
        difficulty: "3",
        "time commitment": "6-12 hours",
        "review date": REVIEW_DATE_WITHIN_TWO_YEARS,
      }),
      buildSheetReview({
        difficulty: "1",
        "time commitment": "0-5 hours",
        "review date": REVIEW_DATE_WITHIN_SIX_MONTHS,
      }),
    ];
    const cs161Tags = classList.find(({ code }) => code === "CS 161")?.tags;
    const cs161Summary = { code: "CS 161", title: "Introduction to Computer Science I", tags: cs161Tags };

    await saveCourses(reviews);

    const summary = readSavedSummary();
    expect(summary["All Time"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "3", "time commitment": "11", "review count": "3" },
    ]);
    expect(summary["Past 2 Years"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "2", "time commitment": "6", "review count": "2" },
    ]);
    expect(summary["Past 6 Months"]).toStrictEqual([
      { ...cs161Summary, "average difficulty": "1", "time commitment": "3", "review count": "1" },
    ]);
  });

  it("saves a zeroed row when the course has no reviews in the date range", async () => {
    const reviews = [
      buildSheetReview({
        name: "CS 162 - Intro to Computer Science II",
        difficulty: "4",
        "time commitment": "13-18 hours",
        "review date": REVIEW_DATE_OLDER_THAN_TWO_YEARS,
      }),
    ];
    const cs162Tags = classList.find(({ code }) => code === "CS 162")?.tags;
    const cs162Summary = { code: "CS 162", title: "Introduction to Computer Science II", tags: cs162Tags };

    await saveCourses(reviews);

    const summary = readSavedSummary();
    expect(summary["All Time"]).toStrictEqual([
      { ...cs162Summary, "average difficulty": "4", "time commitment": "15", "review count": "1" },
    ]);
    expect(summary["Past 6 Months"]).toStrictEqual([
      { ...cs162Summary, "average difficulty": "0", "time commitment": "0", "review count": "0" },
    ]);
  });

  it("saves no tags when the course is not in the class list", async () => {
    const reviews = [buildSheetReview({ name: "CS 496 - Mobile and Cloud Software Development" })];

    await saveCourses(reviews);

    const summary = readSavedSummary();
    expect(summary["All Time"]).toStrictEqual([
      {
        code: "CS 496",
        title: "Mobile and Cloud Software Development",
        "average difficulty": "2",
        "time commitment": "9",
        "review count": "1",
        tags: [],
      },
    ]);
  });

  it("saves one course when reviews spell the CS 381 dash differently", async () => {
    const reviews = [
      buildSheetReview({ name: "CS 381 - Programming Language Fundamentals" }),
      buildSheetReview({ name: "CS 381- Programming Language Fundamentals" }),
    ];
    const cs381Tags = classList.find(({ code }) => code === "CS 381")?.tags;

    await saveCourses(reviews);

    const summary = readSavedSummary();
    expect(summary["All Time"]).toStrictEqual([
      {
        code: "CS 381",
        title: "Programming Language Fundamentals",
        "average difficulty": "2",
        "time commitment": "9",
        "review count": "2",
        tags: cs381Tags,
      },
    ]);
  });

  it("saves one CS 374 course when reviews use the retired CS 344 name", async () => {
    const reviews = [
      buildSheetReview({ name: "CS 344 - Operating Systems" }),
      buildSheetReview({ name: "CS 374 - Operating Systems I" }),
    ];
    const cs374Tags = classList.find(({ code }) => code === "CS 374")?.tags;

    await saveCourses(reviews);

    const summary = readSavedSummary();
    expect(summary["All Time"]).toStrictEqual([
      {
        code: "CS 374",
        title: "Operating Systems I",
        "average difficulty": "2",
        "time commitment": "9",
        "review count": "2",
        tags: cs374Tags,
      },
    ]);
  });

  it("saves reviews split into code and title after deleting the stored reviews", async () => {
    const review = buildSheetReview({
      name: "CS 261 - Data Structures",
      "other courses": ["CS 290 - Web Development"],
    });
    const storedReview = {
      code: "CS 261",
      title: "Data Structures",
      difficulty: review.difficulty,
      "time commitment": review["time commitment"],
      review: review.review,
      "review date": review["review date"],
      quarter: review.quarter,
      "other courses": review["other courses"],
    };

    await saveCourses([review]);

    const deleteOrder = deleteMany.mock.invocationCallOrder[0];
    const insertOrder = insertMany.mock.invocationCallOrder[0];
    expect(deleteMany).toHaveBeenCalledWith({});
    expect(insertMany).toHaveBeenCalledWith([storedReview]);
    expect(deleteOrder).toBeLessThan(insertOrder);
  });

  it("saves the summary with upsert when saving courses", async () => {
    await saveCourses([buildSheetReview()]);

    const [filter, , options] = findOneAndUpdate.mock.calls[0];
    expect(filter).toStrictEqual({});
    expect(options).toStrictEqual({ upsert: true });
  });
});
