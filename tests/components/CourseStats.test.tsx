import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CourseStats from "../../components/CourseReview/CourseStats";
import { buildReview } from "../support/fixtures";
import { renderWithProvider } from "../support/renderWithProvider";

const PAIRING_CODE_PATTERN = /^[A-Z]+ \d+:$/;
const PAIRING_COUNT_PATTERN = /^\d+ times?$/;

function readPairingCodes() {
  return screen.getAllByText(PAIRING_CODE_PATTERN).map((element) => element.textContent);
}

function readPairingCounts() {
  return screen.getAllByText(PAIRING_COUNT_PATTERN).map((element) => element.textContent);
}

function readHoursPerWeek() {
  return screen.getByText("Hours per Week").previousElementSibling?.textContent;
}

describe("CourseStats", () => {
  it("renders the average hours per week across reviews with a recognized time commitment", () => {
    const reviews = [buildReview({ "time commitment": "6-12 hours" }), buildReview({ "time commitment": "18+ hours" })];

    renderWithProvider(<CourseStats courseData={reviews} />);

    const hoursPerWeek = readHoursPerWeek();
    expect(hoursPerWeek).toBe("15");
  });

  it("renders the average hours per week without counting a review with an unrecognized time commitment", () => {
    const reviews = [
      buildReview({ "time commitment": "6-12 hours" }),
      buildReview({ "time commitment": "18+ hours" }),
      buildReview({ "time commitment": "a lot" }),
    ];

    renderWithProvider(<CourseStats courseData={reviews} />);

    const hoursPerWeek = readHoursPerWeek();
    expect(hoursPerWeek).toBe("15");
  });

  it("renders 0 hours per week when no review has a recognized time commitment", () => {
    const reviews = [buildReview({ "time commitment": "a lot" })];

    renderWithProvider(<CourseStats courseData={reviews} />);

    const hoursPerWeek = readHoursPerWeek();
    expect(hoursPerWeek).toBe("0");
  });

  it("renders pairings with the most common first and the number of times each was taken", () => {
    const reviews = [
      buildReview({ "other courses": ["CS 290 - Web Development", "CS 261 - Data Structures"] }),
      buildReview({ "other courses": ["CS 261 - Data Structures"] }),
      buildReview({ "other courses": ["CS 261 - Data Structures", "MTH 231 - Discrete Mathematics"] }),
    ];

    renderWithProvider(<CourseStats courseData={reviews} />);

    const pairingCodes = readPairingCodes();
    const pairingCounts = readPairingCounts();
    expect(pairingCodes).toStrictEqual(["CS 261:", "CS 290:", "MTH 231:"]);
    expect(pairingCounts).toStrictEqual(["3 times", "1 time", "1 time"]);
  });

  it("renders None in place of pairings when no review lists other courses", () => {
    renderWithProvider(<CourseStats courseData={[buildReview({ "other courses": [] })]} />);

    const placeholder = screen.getByText("None");
    const pairingCodes = screen.queryAllByText(PAIRING_CODE_PATTERN);
    expect(placeholder).toBeInTheDocument();
    expect(pairingCodes).toStrictEqual([]);
  });

  it("renders the date filter select named by the visible Filter label", () => {
    renderWithProvider(<CourseStats courseData={[buildReview()]} />);

    const dateFilter = screen.getByRole("combobox", { name: "Filter:" });
    expect(dateFilter).toBeInTheDocument();
  });
});
