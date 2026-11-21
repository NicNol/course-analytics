import { parse } from "csv-parse/sync";
import { findListedCourse } from "./classList";
import type { ICourse } from "./reviews";

export const SURVEY_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/export?format=csv";

const REUSE_MILLISECONDS = 5 * 60 * 1000;

const COURSE_QUESTIONS = [
  "What Course Did You Take?",
  "How hard was this class?",
  "How much time did you spend on average (per week) for this class?",
  "What tips would you give students taking this course?",
];

const EXPECTED_HEADERS = [
  "Timestamp",
  ...COURSE_QUESTIONS,
  "When did you take this course?",
  "Did You Take a Second Course This Quarter?",
  ...COURSE_QUESTIONS,
  "Did You Take a Third Course This Quarter?",
  ...COURSE_QUESTIONS,
];

const COURSE_COLUMNS = [
  { taken: undefined, course: 1, difficulty: 2, time: 3, tips: 4 },
  { taken: 6, course: 7, difficulty: 8, time: 9, tips: 10 },
  { taken: 11, course: 12, difficulty: 13, time: 14, tips: 15 },
];

const TIMESTAMP_COLUMN = 0;
const QUARTER_COLUMN = 5;

let latestDownload: { reviews: Promise<ICourse[]>; startedAt: number } | undefined;

export function getReviews() {
  const now = Date.now();
  if (latestDownload && now - latestDownload.startedAt < REUSE_MILLISECONDS) return latestDownload.reviews;

  const download = { reviews: downloadReviews(), startedAt: now };
  latestDownload = download;
  download.reviews.catch(() => {
    if (latestDownload === download) latestDownload = undefined;
  });
  return download.reviews;
}

async function downloadReviews() {
  const response = await fetch(SURVEY_CSV_URL);
  if (!response.ok) throw new Error(`Survey download failed with status ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("text/csv")) throw new Error(`Survey download returned ${contentType} instead of CSV`);

  const [headers = [], ...rows] = parse(await response.text(), { relax_column_count: true });
  const checkedHeaders = headers.slice(0, EXPECTED_HEADERS.length);
  if (JSON.stringify(checkedHeaders) !== JSON.stringify(EXPECTED_HEADERS)) {
    throw new Error(`Survey headers changed: ${JSON.stringify(checkedHeaders)}`);
  }

  return rows.flatMap(reviewsFromRow);
}

function reviewsFromRow(row: string[]): ICourse[] {
  const cell = (column: number) => row[column] ?? "";
  const takenCourses = COURSE_COLUMNS.filter(({ taken }) => taken === undefined || cell(taken) === "Yes").flatMap(
    (columns) => {
      const listedCourse = findListedCourse(cell(columns.course));
      return listedCourse ? [{ columns, listedCourse }] : [];
    },
  );

  return takenCourses.map(({ columns, listedCourse }) => ({
    code: listedCourse.code,
    title: listedCourse.title,
    difficulty: cell(columns.difficulty),
    "time commitment": cell(columns.time),
    review: cell(columns.tips),
    "review date": cell(TIMESTAMP_COLUMN),
    quarter: cell(QUARTER_COLUMN),
    "other courses": takenCourses
      .filter((other) => other.listedCourse.code !== listedCourse.code)
      .map((other) => `${other.listedCourse.code} - ${other.listedCourse.title}`),
  }));
}
