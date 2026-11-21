import { describe, expect, it, vi } from "vitest";
import type { ICourse } from "../../../lib/models/course";
import { formatCourseName, saveCourses } from "../../../scraper/helper/summarize";
import { buildSheetReview } from "../../support/fixtures";
import { firstCallArguments, firstInvocationOrder } from "../../support/mockCalls";

const { deleteMany, insertMany, runInTransaction, transactionSession } = vi.hoisted(() => {
  const transactionSession = { id: "transaction-session" };
  return {
    deleteMany: vi.fn(),
    insertMany: vi.fn(),
    runInTransaction: vi.fn((work: (session: unknown) => Promise<unknown>) => work(transactionSession)),
    transactionSession,
  };
});

vi.mock("../../../lib/mongodb", () => ({ runInTransaction }));
vi.mock("../../../lib/models/course", () => ({ Course: { deleteMany, insertMany } }));

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
  function readInsertedReviews() {
    return firstCallArguments(insertMany)[0];
  }

  it("logs one warning listing each distinct unrecognized time commitment when reviews have unrecognized time commitments", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const reviews = [
      buildSheetReview({ "time commitment": "a few hours" }),
      buildSheetReview({ "time commitment": "a few hours" }),
      buildSheetReview({ "time commitment": "" }),
      buildSheetReview({ "time commitment": "6-12 hours" }),
    ];

    await saveCourses(reviews);

    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('"a few hours", ""'));
  });

  it("logs a warning when the time commitment is named like an object property", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const reviews = [buildSheetReview({ "time commitment": "constructor" })];

    await saveCourses(reviews);

    expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('"constructor"'));
  });

  it("logs no warning when every time commitment is recognized", async () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await saveCourses([buildSheetReview({ "time commitment": "0-5 hours" })]);

    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it("saves the same code and title when reviews spell the CS 381 dash differently", async () => {
    const reviews = [
      buildSheetReview({ name: "CS 381 - Programming Language Fundamentals" }),
      buildSheetReview({ name: "CS 381- Programming Language Fundamentals" }),
    ];

    await saveCourses(reviews);

    const insertedCourses = readInsertedReviews().map(({ code, title }: ICourse) => ({ code, title }));
    expect(insertedCourses).toStrictEqual([
      { code: "CS 381", title: "Programming Language Fundamentals" },
      { code: "CS 381", title: "Programming Language Fundamentals" },
    ]);
  });

  it("saves the CS 374 code and title when reviews use the retired CS 344 name", async () => {
    const reviews = [
      buildSheetReview({ name: "CS 344 - Operating Systems" }),
      buildSheetReview({ name: "CS 374 - Operating Systems I" }),
    ];

    await saveCourses(reviews);

    const insertedCourses = readInsertedReviews().map(({ code, title }: ICourse) => ({ code, title }));
    expect(insertedCourses).toStrictEqual([
      { code: "CS 374", title: "Operating Systems I" },
      { code: "CS 374", title: "Operating Systems I" },
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

    const deleteOrder = firstInvocationOrder(deleteMany);
    const insertOrder = firstInvocationOrder(insertMany);
    const [deleteFilter] = firstCallArguments(deleteMany);
    expect(deleteFilter).toStrictEqual({});
    expect(readInsertedReviews()).toStrictEqual([storedReview]);
    expect(deleteOrder).toBeLessThan(insertOrder);
  });

  it("writes the delete and the insert with the same transaction session", async () => {
    await saveCourses([buildSheetReview()]);

    const deleteOptions = firstCallArguments(deleteMany)[1];
    const insertOptions = firstCallArguments(insertMany)[1];
    expect(runInTransaction).toHaveBeenCalledTimes(1);
    expect(deleteOptions).toStrictEqual({ session: transactionSession });
    expect(insertOptions).toStrictEqual({ session: transactionSession });
  });

  it("rejects with the error when inserting the reviews fails", async () => {
    const failure = new Error("insert failed");
    insertMany.mockRejectedValue(failure);

    const saving = saveCourses([buildSheetReview()]);

    await expect(saving).rejects.toBe(failure);
  });
});
