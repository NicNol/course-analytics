import { describe, expect, it, vi } from "vitest";
import { useFixedClock } from "../support/fixedClock";

const SURVEY_HEADERS = [
  "Timestamp",
  "What Course Did You Take?",
  "How hard was this class?",
  "How much time did you spend on average (per week) for this class?",
  "What tips would you give students taking this course?",
  "When did you take this course?",
  "Did You Take a Second Course This Quarter?",
  "What Course Did You Take?",
  "How hard was this class?",
  "How much time did you spend on average (per week) for this class?",
  "What tips would you give students taking this course?",
  "Did You Take a Third Course This Quarter?",
  "What Course Did You Take?",
  "How hard was this class?",
  "How much time did you spend on average (per week) for this class?",
  "What tips would you give students taking this course?",
];

const SURVEY_EXPORT_URL =
  "https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/export?format=csv";

const FIVE_MINUTES = 5 * 60 * 1000;

const threeCourseRow = [
  "6/1/2026 10:00:00",
  "CS 261 - Data Structures",
  "3",
  "6-12 hours",
  "Draw the trees.",
  "SP 2026",
  "Yes",
  "CS 344 - Operating Systems",
  "5",
  "18+ hours",
  "Start the projects early.",
  "Yes",
  "CS 274 - Intro to Systems Programming",
  "2",
  "0-5 hours",
  "",
];

const oneCourseRowWithLeftoverAnswers = [
  "6/2/2026 11:00:00",
  "CS 161 - Intro to Computer Science I",
  "2",
  "0-5 hours",
  "Start early.",
  "SP 2026",
  "No",
  "CS 162 - Intro to Computer Science II",
  "4",
  "13-18 hours",
  "This answer belongs to no course.",
  "No",
  "CS 225 - Discrete Structures in Computer Science",
  "1",
  "0-5 hours",
  "Neither does this one.",
];

const rowWithUnlistedCourse = [
  "6/3/2026 12:00:00",
  "CS 165 - Intro to Computer Science (Accelerated)",
  "4",
  "18+ hours",
  "Fast paced.",
  "SU 2026",
  "Yes",
  "CS 225 - Discrete Structures in Computer Science",
  "3",
  "6-12 hours",
  "Practice proofs.",
  "No",
  "",
  "",
  "",
  "",
];

function toCsv(rows: string[][]) {
  return rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(",")).join("\n");
}

function csvTextResponse(text: string) {
  return new Response(text, { headers: { "content-type": "text/csv; charset=utf-8" } });
}

function csvResponse(rows: string[][], headers = SURVEY_HEADERS) {
  return csvTextResponse(toCsv([headers, ...rows]));
}

function serveSurvey(rows: string[][], headers = SURVEY_HEADERS) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () => csvResponse(rows, headers));
}

async function loadSurvey() {
  vi.resetModules();
  return import("../../lib/survey");
}

describe("getReviews", () => {
  useFixedClock("2026-06-15T12:00:00Z");

  it("downloads the survey export", async () => {
    const fetchSpy = serveSurvey([]);
    const { getReviews } = await loadSurvey();

    await getReviews();

    expect(fetchSpy).toHaveBeenCalledWith(SURVEY_EXPORT_URL);
  });

  it("returns one review per taken course with the class list code and title", async () => {
    serveSurvey([threeCourseRow]);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    expect(reviews).toStrictEqual([
      {
        code: "CS 261",
        title: "Data Structures",
        difficulty: "3",
        "time commitment": "6-12 hours",
        review: "Draw the trees.",
        "review date": "6/1/2026 10:00:00",
        quarter: "SP 2026",
        "other courses": ["CS 374 - Operating Systems I", "CS 274 - Introduction to Systems Programming"],
      },
      {
        code: "CS 374",
        title: "Operating Systems I",
        difficulty: "5",
        "time commitment": "18+ hours",
        review: "Start the projects early.",
        "review date": "6/1/2026 10:00:00",
        quarter: "SP 2026",
        "other courses": ["CS 261 - Data Structures", "CS 274 - Introduction to Systems Programming"],
      },
      {
        code: "CS 274",
        title: "Introduction to Systems Programming",
        difficulty: "2",
        "time commitment": "0-5 hours",
        review: "",
        "review date": "6/1/2026 10:00:00",
        quarter: "SP 2026",
        "other courses": ["CS 261 - Data Structures", "CS 374 - Operating Systems I"],
      },
    ]);
  });

  it("returns only the first course when the student did not answer Yes to a second or third course", async () => {
    serveSurvey([oneCourseRowWithLeftoverAnswers]);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    expect(reviews).toStrictEqual([
      {
        code: "CS 161",
        title: "Introduction to Computer Science I",
        difficulty: "2",
        "time commitment": "0-5 hours",
        review: "Start early.",
        "review date": "6/2/2026 11:00:00",
        quarter: "SP 2026",
        "other courses": [],
      },
    ]);
  });

  it("returns no review and no pairing for a course missing from the class list", async () => {
    serveSurvey([rowWithUnlistedCourse]);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    const codes = reviews.map(({ code }) => code);
    const pairings = reviews.flatMap((review) => review["other courses"]);
    expect(codes).toStrictEqual(["CS 225"]);
    expect(pairings).toStrictEqual([]);
  });

  it("returns review text with its commas, quotes and line breaks", async () => {
    const tipWithPunctuation = 'Start early, "really" early.\nThen ask for help.';
    serveSurvey([oneCourseRowWithLeftoverAnswers.with(4, tipWithPunctuation)]);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    const tips = reviews.map(({ review }) => review);
    expect(tips).toStrictEqual([tipWithPunctuation]);
  });

  it("returns reviews when a row has fewer cells than the header", async () => {
    const rowWithoutThirdCourseAnswers = oneCourseRowWithLeftoverAnswers.slice(0, 12);
    serveSurvey([rowWithoutThirdCourseAnswers]);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    const codes = reviews.map(({ code }) => code);
    expect(codes).toStrictEqual(["CS 161"]);
  });

  it("returns reviews when the sheet has extra columns after the survey questions", async () => {
    const headersWithNewQuestion = [...SURVEY_HEADERS, "What would you change about this survey?"];
    const rowWithNewAnswer = [...oneCourseRowWithLeftoverAnswers, "Nothing."];
    serveSurvey([rowWithNewAnswer], headersWithNewQuestion);
    const { getReviews } = await loadSurvey();

    const reviews = await getReviews();

    const codes = reviews.map(({ code }) => code);
    expect(codes).toStrictEqual(["CS 161"]);
  });

  it("rejects when a survey question header changes", async () => {
    const renamedHeaders = SURVEY_HEADERS.with(3, "How many hours per week did you spend on this class?");
    serveSurvey([], renamedHeaders);
    const { getReviews } = await loadSurvey();

    const reviews = getReviews();

    await expect(reviews).rejects.toThrow("Survey headers changed");
  });

  it("rejects when the download is cut off inside a quoted answer", async () => {
    const cutOffDownload = toCsv([SURVEY_HEADERS, oneCourseRowWithLeftoverAnswers]).slice(0, -1);
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => csvTextResponse(cutOffDownload));
    const { getReviews } = await loadSurvey();

    const reviews = getReviews();

    await expect(reviews).rejects.toMatchObject({ code: "CSV_QUOTE_NOT_CLOSED" });
  });

  it("rejects with the status when the download fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response("Not Found", { status: 404 }));
    const { getReviews } = await loadSurvey();

    const reviews = getReviews();

    await expect(reviews).rejects.toThrow("status 404");
  });

  it("rejects when the download returns a web page instead of CSV", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response("<html>Sign in</html>", { headers: { "content-type": "text/html; charset=utf-8" } }),
    );
    const { getReviews } = await loadSurvey();

    const reviews = getReviews();

    await expect(reviews).rejects.toThrow("text/html");
  });

  it("returns the first download without downloading again within five minutes", async () => {
    const fetchSpy = serveSurvey([oneCourseRowWithLeftoverAnswers]);
    const { getReviews } = await loadSurvey();
    const firstReviews = await getReviews();
    vi.setSystemTime(Date.now() + FIVE_MINUTES - 1);

    const secondReviews = await getReviews();

    expect(secondReviews).toBe(firstReviews);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("downloads once when requests arrive while the first download is still running", async () => {
    const fetchSpy = serveSurvey([oneCourseRowWithLeftoverAnswers]);
    const { getReviews } = await loadSurvey();

    const simultaneousReviews = await Promise.all([getReviews(), getReviews(), getReviews()]);

    const codes = simultaneousReviews.map((reviews) => reviews.map(({ code }) => code));
    expect(codes).toStrictEqual([["CS 161"], ["CS 161"], ["CS 161"]]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("downloads again once five minutes have passed", async () => {
    const fetchSpy = serveSurvey([oneCourseRowWithLeftoverAnswers]);
    const { getReviews } = await loadSurvey();
    await getReviews();
    vi.setSystemTime(Date.now() + FIVE_MINUTES);

    await getReviews();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("downloads again on the next request after a failed download", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementationOnce(async () => new Response("Server Error", { status: 500 }))
      .mockImplementation(async () => csvResponse([oneCourseRowWithLeftoverAnswers]));
    const { getReviews } = await loadSurvey();
    await getReviews().catch(() => undefined);

    const reviews = await getReviews();

    const codes = reviews.map(({ code }) => code);
    expect(codes).toStrictEqual(["CS 161"]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("downloads no third time when an older download fails after a newer one started", async () => {
    let failOldDownload: (error: Error) => void = () => {};
    const oldDownload = new Promise<Response>((_resolve, reject) => {
      failOldDownload = reject;
    });
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementationOnce(() => oldDownload)
      .mockImplementation(async () => csvResponse([oneCourseRowWithLeftoverAnswers]));
    const { getReviews } = await loadSurvey();
    const oldReviews = getReviews().catch(() => undefined);
    vi.setSystemTime(Date.now() + FIVE_MINUTES);
    await getReviews();
    failOldDownload(new Error("socket hang up"));
    await oldReviews;

    await getReviews();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
