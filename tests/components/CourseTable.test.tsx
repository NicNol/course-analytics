import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CourseTable from "../../components/CourseTable/CourseTable";
import { buildSummaryRow } from "../support/fixtures";
import { renderWithProvider } from "../support/renderWithProvider";

const easyLongCourse = buildSummaryRow({
  code: "CS 161",
  title: "Introduction to Computer Science I",
  "average difficulty": "2.5",
  "time commitment": "15",
  "review count": "120",
  tags: ["Lower Division", "Core Class"],
});
const hardShortCourse = buildSummaryRow({
  code: "CS 261",
  title: "Computer Architecture",
  "average difficulty": "4.0",
  "time commitment": "9",
  "review count": "40",
  tags: ["Upper Division", "Core Class"],
});
const mediumPopularCourse = buildSummaryRow({
  code: "CS 361",
  title: "Software Engineering I",
  "average difficulty": "3.0",
  "time commitment": "12",
  "review count": "300",
  tags: ["Upper Division", "Elective"],
});
const allTags = ["Lower Division", "Upper Division", "Core Class", "Elective"];

function buildCourses() {
  return [mediumPopularCourse, easyLongCourse, hardShortCourse];
}

const easyLongLabel = "CS 161 - Introduction to Computer Science I";
const hardShortLabel = "CS 261 - Computer Architecture";
const mediumPopularLabel = "CS 361 - Software Engineering I";

function renderTable(filter = allTags) {
  return renderWithProvider(<CourseTable filter={filter} jsonData={buildCourses()} />);
}

function readRowLabels() {
  const table = screen.getByRole("table");
  return within(table)
    .getAllByRole("link")
    .map((link) => link.textContent);
}

function readSortStates() {
  const headers = screen.getAllByRole("columnheader");
  return Object.fromEntries(headers.map((header) => [header.textContent, header.getAttribute("aria-sort")]));
}

describe("CourseTable", () => {
  it("renders courses in ascending course code order when the table loads", () => {
    renderTable();

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([easyLongLabel, hardShortLabel, mediumPopularLabel]);
  });

  it("renders the difficulty, hours, and review count of every course when the table loads", () => {
    renderTable();

    const expectedCellTexts = [
      "2.5 / 5.0",
      "15 Hours",
      "120 Reviews",
      "4.0 / 5.0",
      "9 Hours",
      "40 Reviews",
      "3.0 / 5.0",
      "12 Hours",
      "300 Reviews",
    ];
    const missingCellTexts = expectedCellTexts.filter((text) => screen.queryByText(text) === null);
    expect(missingCellTexts).toStrictEqual([]);
  });

  it("renders only courses with a tag in the filter when a filter is given", () => {
    renderTable(["Elective"]);

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([mediumPopularLabel]);
  });

  it("renders courses in descending course code order when Course Name is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Course Name"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([mediumPopularLabel, hardShortLabel, easyLongLabel]);
  });

  it("renders courses in ascending difficulty order when Difficulty is clicked once", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Difficulty"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([easyLongLabel, mediumPopularLabel, hardShortLabel]);
  });

  it("renders courses in descending difficulty order when Difficulty is clicked twice", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Difficulty"));
    await user.click(screen.getByText("Difficulty"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([hardShortLabel, mediumPopularLabel, easyLongLabel]);
  });

  it("renders courses in ascending order of the new column when another column is clicked after Difficulty", async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(screen.getByText("Difficulty"));
    await user.click(screen.getByText("Difficulty"));

    await user.click(screen.getByText("Time Commitment"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([hardShortLabel, mediumPopularLabel, easyLongLabel]);
  });

  it("renders courses in ascending order of review count when Review Count is clicked", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Review Count"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([hardShortLabel, easyLongLabel, mediumPopularLabel]);
  });

  it("renders courses in ascending course code order when the table is mounted again after another table was sorted", async () => {
    const user = userEvent.setup();
    const { unmount } = renderTable();
    await user.click(screen.getByText("Review Count"));
    unmount();

    renderTable();

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([easyLongLabel, hardShortLabel, mediumPopularLabel]);
  });

  it("renders only Course Name as sorted ascending when the table loads", () => {
    renderTable();

    const sortStates = readSortStates();
    expect(sortStates).toStrictEqual({
      "Course Name": "ascending",
      Difficulty: "none",
      "Time Commitment": "none",
      "Review Count": "none",
    });
  });

  it("renders only Difficulty as sorted ascending when Difficulty is clicked once", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Difficulty"));

    const sortStates = readSortStates();
    expect(sortStates).toStrictEqual({
      "Course Name": "none",
      Difficulty: "ascending",
      "Time Commitment": "none",
      "Review Count": "none",
    });
  });

  it("renders Difficulty as sorted descending when Difficulty is clicked twice", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByText("Difficulty"));
    await user.click(screen.getByText("Difficulty"));

    const sortStates = readSortStates();
    expect(sortStates).toStrictEqual({
      "Course Name": "none",
      Difficulty: "descending",
      "Time Commitment": "none",
      "Review Count": "none",
    });
  });
});
