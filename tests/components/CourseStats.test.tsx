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

describe("CourseStats", () => {
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
});
