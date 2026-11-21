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

function label({ code, title }: { code: string; title: string }) {
  return `${code} - ${title}`;
}

function readRowLabels() {
  const table = screen.getByRole("table");
  return within(table)
    .getAllByRole("link")
    .map((link) => link.textContent);
}

describe("CourseTable", () => {
  it("renders courses in ascending course code order when the table loads", () => {
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(easyLongCourse), label(hardShortCourse), label(mediumPopularCourse)]);
  });

  it("renders only courses with a tag in the filter when a filter is given", () => {
    renderWithProvider(<CourseTable filter={["Elective"]} jsonData={buildCourses()} />);

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(mediumPopularCourse)]);
  });

  it("renders courses in descending course code order when Course Name is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    await user.click(screen.getByText("Course Name"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(mediumPopularCourse), label(hardShortCourse), label(easyLongCourse)]);
  });

  it("renders courses in ascending difficulty order when Difficulty is clicked once", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    await user.click(screen.getByText("Difficulty"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(easyLongCourse), label(mediumPopularCourse), label(hardShortCourse)]);
  });

  it("renders courses in descending difficulty order when Difficulty is clicked twice", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    await user.click(screen.getByText("Difficulty"));
    await user.click(screen.getByText("Difficulty"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(hardShortCourse), label(mediumPopularCourse), label(easyLongCourse)]);
  });

  it("renders courses in ascending order of the new column when another column is clicked after Difficulty", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);
    await user.click(screen.getByText("Difficulty"));
    await user.click(screen.getByText("Difficulty"));

    await user.click(screen.getByText("Time Commitment"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(hardShortCourse), label(mediumPopularCourse), label(easyLongCourse)]);
  });

  it("renders courses in ascending order of review count when Review Count is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    await user.click(screen.getByText("Review Count"));

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(hardShortCourse), label(easyLongCourse), label(mediumPopularCourse)]);
  });

  it("renders courses in ascending course code order when the table is mounted again after another table was sorted", async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);
    await user.click(screen.getByText("Review Count"));
    unmount();

    renderWithProvider(<CourseTable filter={allTags} jsonData={buildCourses()} />);

    const rowLabels = readRowLabels();
    expect(rowLabels).toStrictEqual([label(easyLongCourse), label(hardShortCourse), label(mediumPopularCourse)]);
  });
});
