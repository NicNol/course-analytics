import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Home from "../../pages/index";
import { buildSummaryRow } from "../support/fixtures";
import { renderWithProvider } from "../support/renderWithProvider";

vi.mock("../../lib/mongodb", () => ({ connectToDatabase: vi.fn() }));
vi.mock("../../lib/models/course", () => ({ Course: { find: vi.fn() } }));

const lowerDivisionCourse = buildSummaryRow({
  code: "CS 161",
  title: "Introduction to Computer Science I",
  tags: ["Lower Division", "Core Class"],
});
const upperDivisionCourse = buildSummaryRow({
  code: "CS 361",
  title: "Software Engineering I",
  tags: ["Upper Division", "Core Class"],
});
const recentElectiveCourse = buildSummaryRow({
  code: "CS 493",
  title: "Cloud Application Development",
  tags: ["Upper Division", "Elective"],
});
const allCourses = [lowerDivisionCourse, upperDivisionCourse, recentElectiveCourse];

function buildSummaryByDate() {
  return [
    {
      "All Time": [lowerDivisionCourse, upperDivisionCourse, recentElectiveCourse],
      "Past 2 Years": [lowerDivisionCourse, recentElectiveCourse],
      "Past 6 Months": [recentElectiveCourse],
    },
  ];
}

function readShownTitles() {
  return allCourses.map(({ title }) => title).filter((title) => screen.queryByText(title) !== null);
}

describe("Home", () => {
  it("renders a card for every course and no table when the page loads", () => {
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    const shownTitles = readShownTitles();
    const table = screen.queryByRole("table");
    expect(shownTitles).toStrictEqual(allCourses.map(({ title }) => title));
    expect(table).not.toBeInTheDocument();
  });

  it.each([
    { option: "Lower Division", expectedCourses: [lowerDivisionCourse] },
    { option: "Upper Division", expectedCourses: [upperDivisionCourse, recentElectiveCourse] },
    { option: "Core Classes", expectedCourses: [lowerDivisionCourse, upperDivisionCourse] },
    { option: "Electives", expectedCourses: [recentElectiveCourse] },
  ])("renders only the matching cards when $option is chosen", async ({ option, expectedCourses }) => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "All Classes" }));
    await user.click(await screen.findByRole("menuitem", { name: option }));

    const shownTitles = readShownTitles();
    expect(shownTitles).toStrictEqual(expectedCourses.map(({ title }) => title));
  });

  it("renders no cards when there is no summary data", () => {
    renderWithProvider(<Home data={[]} />);

    const detailButtons = screen.queryAllByRole("button", { name: /View Details/ });
    const classFilter = screen.getByRole("button", { name: "All Classes" });
    expect(detailButtons).toStrictEqual([]);
    expect(classFilter).toBeInTheDocument();
  });

  it("renders only the table header row when there is no summary data and Table View is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={[]} />);

    await user.click(screen.getByRole("button", { name: "Card View" }));
    await user.click(await screen.findByRole("menuitem", { name: "Table View" }));

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(1);
  });

  it("renders a table with a linked row for every course when Table View is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "Card View" }));
    await user.click(await screen.findByRole("menuitem", { name: "Table View" }));

    const table = screen.getByRole("table");
    const links = within(table).getAllByRole("link");
    const linkTargets = links.map((link) => [link.textContent, link.getAttribute("href")]);
    expect(linkTargets).toStrictEqual([
      ["CS 161 - Introduction to Computer Science I", "/courses/CS-161"],
      ["CS 361 - Software Engineering I", "/courses/CS-361"],
      ["CS 493 - Cloud Application Development", "/courses/CS-493"],
    ]);
  });

  it("renders only courses in the chosen date range when Past 6 Months is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "All Time" }));
    await user.click(await screen.findByRole("menuitem", { name: "Past 6 Months" }));

    const shownTitles = readShownTitles();
    expect(shownTitles).toStrictEqual([recentElectiveCourse.title]);
  });
});
