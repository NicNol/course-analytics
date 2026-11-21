import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getJSON } from "../../../scraper/helper/sheets";
import { completeEnv } from "../../support/env";

vi.mock("google-auth-library", () => ({ JWT: vi.fn() }));
vi.mock("google-spreadsheet", () => ({ GoogleSpreadsheet: vi.fn() }));

type SheetRow = { get: (column: string) => string | undefined };

const SURVEY_TIMESTAMP = "6/1/2026 10:00:00";
const SURVEY_QUARTER = "SP 2026";
const SLEEP_BEFORE_READING_MS = 2000;

const oneCourseRow = {
  timestamp: SURVEY_TIMESTAMP,
  course1: "CS 161 - Intro to Computer Science I",
  difficulty1: "2",
  time1: "0-5 hours",
  tips1: "Start early.",
  when1: SURVEY_QUARTER,
  secondBool: "No",
  thirdBool: "No",
};

const threeCourseRow = {
  timestamp: SURVEY_TIMESTAMP,
  course1: "CS 261 - Data Structures",
  difficulty1: "3",
  time1: "6-12 hours",
  tips1: "Draw the trees.",
  when1: SURVEY_QUARTER,
  secondBool: "Yes",
  course2: "CS 290 - Web Development",
  difficulty2: "4",
  time2: "13-18 hours",
  tips2: "Start the last assignment early.",
  thirdBool: "Yes",
  course3: "CS 340 - Introduction to Databases",
  difficulty3: "1",
  time3: "0-5 hours",
  tips3: "Pick a partner early.",
};

const renamedCourseRow = {
  timestamp: SURVEY_TIMESTAMP,
  course1: "CS 344 - Operating Systems",
  difficulty1: "5",
  time1: "18+ hours",
  tips1: "Start the projects early.",
  when1: SURVEY_QUARTER,
  secondBool: "Yes",
  course2: "CS 261 - Data Structures",
  difficulty2: "3",
  time2: "6-12 hours",
  tips2: "Do the worksheets.",
  thirdBool: "No",
};

function buildRow(values: Record<string, string>): SheetRow {
  return { get: (column) => values[column] };
}

function stubWorksheets(sheetsByIndex: { getRows: () => Promise<SheetRow[]> }[]) {
  vi.mocked(GoogleSpreadsheet).mockImplementation(function () {
    return { loadInfo: vi.fn(), sheetsByIndex };
  } as never);
}

function stubSurveyRows(rows: SheetRow[]) {
  stubWorksheets([{ getRows: vi.fn().mockResolvedValue(rows) }]);
}

async function readReviews() {
  const reviews = getJSON();
  await vi.advanceTimersByTimeAsync(SLEEP_BEFORE_READING_MS);
  return reviews;
}

describe("getJSON", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("GOOGLE_CLIENT_EMAIL", completeEnv.GOOGLE_CLIENT_EMAIL);
    vi.stubEnv("GOOGLE_PRIVATE_KEY", completeEnv.GOOGLE_PRIVATE_KEY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("authenticates with the service account email and a private key with real line breaks", async () => {
    stubSurveyRows([]);

    await readReviews();

    expect(JWT).toHaveBeenCalledWith({
      email: completeEnv.GOOGLE_CLIENT_EMAIL,
      key: "-----BEGIN PRIVATE KEY-----\nabc123\n-----END PRIVATE KEY-----\n",
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
    });
  });

  it.each(["GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"])(
    "rejects naming %s without opening a spreadsheet when the variable is not set",
    async (variableName) => {
      vi.stubEnv(variableName, "");
      stubSurveyRows([]);

      const reviews = getJSON();
      const rejection = expect(reviews).rejects.toThrow(variableName);
      await vi.advanceTimersByTimeAsync(SLEEP_BEFORE_READING_MS);

      await rejection;
      expect(GoogleSpreadsheet).not.toHaveBeenCalled();
    },
  );

  it("rejects naming the worksheet when the spreadsheet has no worksheets", async () => {
    stubWorksheets([]);

    const reviews = getJSON();
    const rejection = expect(reviews).rejects.toThrow("worksheet");
    await vi.advanceTimersByTimeAsync(SLEEP_BEFORE_READING_MS);

    await rejection;
  });

  it("returns one review with the form answers when the row has one course", async () => {
    stubSurveyRows([buildRow(oneCourseRow)]);

    const reviews = await readReviews();

    expect(reviews).toStrictEqual([
      {
        name: "CS 161 - Introduction to Computer Science I",
        difficulty: oneCourseRow.difficulty1,
        "time commitment": oneCourseRow.time1,
        review: oneCourseRow.tips1,
        "review date": oneCourseRow.timestamp,
        quarter: oneCourseRow.when1,
        "other courses": [],
      },
    ]);
  });

  it("returns a review per course listing the other two courses when the row has three courses", async () => {
    stubSurveyRows([buildRow(threeCourseRow)]);

    const reviews = await readReviews();

    expect(reviews).toStrictEqual([
      {
        name: threeCourseRow.course1,
        difficulty: threeCourseRow.difficulty1,
        "time commitment": threeCourseRow.time1,
        review: threeCourseRow.tips1,
        "review date": SURVEY_TIMESTAMP,
        quarter: SURVEY_QUARTER,
        "other courses": [threeCourseRow.course2, threeCourseRow.course3],
      },
      {
        name: threeCourseRow.course2,
        difficulty: threeCourseRow.difficulty2,
        "time commitment": threeCourseRow.time2,
        review: threeCourseRow.tips2,
        "review date": SURVEY_TIMESTAMP,
        quarter: SURVEY_QUARTER,
        "other courses": [threeCourseRow.course1, threeCourseRow.course3],
      },
      {
        name: threeCourseRow.course3,
        difficulty: threeCourseRow.difficulty3,
        "time commitment": threeCourseRow.time3,
        review: threeCourseRow.tips3,
        "review date": SURVEY_TIMESTAMP,
        quarter: SURVEY_QUARTER,
        "other courses": [threeCourseRow.course1, threeCourseRow.course2],
      },
    ]);
  });

  it("returns corrected course names in the other courses when a course was renamed", async () => {
    stubSurveyRows([buildRow(renamedCourseRow)]);

    const reviews = await readReviews();

    const names = reviews.map(({ name }) => name);
    const otherCourses = reviews.map((review) => review["other courses"]);
    expect(names).toStrictEqual(["CS 374 - Operating Systems I", "CS 261 - Data Structures"]);
    expect(otherCourses).toStrictEqual([["CS 261 - Data Structures"], ["CS 374 - Operating Systems I"]]);
  });

  it("returns reviews for every row when the sheet has several rows", async () => {
    stubSurveyRows([buildRow(oneCourseRow), buildRow(renamedCourseRow)]);

    const reviews = await readReviews();

    const names = reviews.map(({ name }) => name);
    expect(names).toStrictEqual([
      "CS 161 - Introduction to Computer Science I",
      "CS 374 - Operating Systems I",
      "CS 261 - Data Structures",
    ]);
  });
});
