import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Home from "../../pages/index";
import { buildSummaryRow } from "../support/fixtures";
import { renderWithProvider } from "../support/renderWithProvider";

vi.mock("../../pages/api/summary/index", () => ({ getSummary: vi.fn() }));

function buildSummaryByDate() {
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
  return [
    {
      "All Time": [lowerDivisionCourse, upperDivisionCourse, recentElectiveCourse],
      "Past 2 Years": [lowerDivisionCourse, recentElectiveCourse],
      "Past 6 Months": [recentElectiveCourse],
    },
  ];
}

const lowerDivisionTitle = "Introduction to Computer Science I";
const upperDivisionTitle = "Software Engineering I";
const recentElectiveTitle = "Cloud Application Development";

describe("Home", () => {
  it("renders a card for every course when the page loads", () => {
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    const lowerDivisionCard = screen.getByText(lowerDivisionTitle);
    const upperDivisionCard = screen.getByText(upperDivisionTitle);
    const recentElectiveCard = screen.getByText(recentElectiveTitle);
    const table = screen.queryByRole("table");
    expect(lowerDivisionCard).toBeInTheDocument();
    expect(upperDivisionCard).toBeInTheDocument();
    expect(recentElectiveCard).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  it("renders only upper division courses when Upper Division is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "All Classes" }));
    await user.click(await screen.findByRole("menuitem", { name: "Upper Division" }));

    const lowerDivisionCard = screen.queryByText(lowerDivisionTitle);
    const upperDivisionCard = screen.getByText(upperDivisionTitle);
    const recentElectiveCard = screen.getByText(recentElectiveTitle);
    expect(lowerDivisionCard).not.toBeInTheDocument();
    expect(upperDivisionCard).toBeInTheDocument();
    expect(recentElectiveCard).toBeInTheDocument();
  });

  it("renders only elective courses when Electives is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "All Classes" }));
    await user.click(await screen.findByRole("menuitem", { name: "Electives" }));

    const lowerDivisionCard = screen.queryByText(lowerDivisionTitle);
    const upperDivisionCard = screen.queryByText(upperDivisionTitle);
    const recentElectiveCard = screen.getByText(recentElectiveTitle);
    expect(lowerDivisionCard).not.toBeInTheDocument();
    expect(upperDivisionCard).not.toBeInTheDocument();
    expect(recentElectiveCard).toBeInTheDocument();
  });

  it("renders a table with a linked row for every course when Table View is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "Card View" }));
    await user.click(await screen.findByRole("menuitem", { name: "Table View" }));

    const table = screen.getByRole("table");
    const upperDivisionLink = within(table).getByRole("link", { name: `CS 361 - ${upperDivisionTitle}` });
    const rows = within(table).getAllByRole("row");
    expect(upperDivisionLink).toHaveAttribute("href", "/courses/CS-361");
    expect(rows).toHaveLength(4);
  });

  it("renders only courses in the chosen date range when Past 6 Months is chosen", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Home data={buildSummaryByDate()} />);

    await user.click(screen.getByRole("button", { name: "All Time" }));
    await user.click(await screen.findByRole("menuitem", { name: "Past 6 Months" }));

    const lowerDivisionCard = screen.queryByText(lowerDivisionTitle);
    const upperDivisionCard = screen.queryByText(upperDivisionTitle);
    const recentElectiveCard = screen.getByText(recentElectiveTitle);
    expect(lowerDivisionCard).not.toBeInTheDocument();
    expect(upperDivisionCard).not.toBeInTheDocument();
    expect(recentElectiveCard).toBeInTheDocument();
  });
});
