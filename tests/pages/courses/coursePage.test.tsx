import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Course from "../../../pages/courses/[courseid]";
import { buildReview } from "../../support/fixtures";
import { renderWithProvider } from "../../support/renderWithProvider";

vi.mock("../../../pages/api/courses", () => ({ getCourseData: vi.fn() }));

const courseCode = "CS 374";
const courseTitle = "Operating Systems I";

function buildMonthlyReviews(count: number) {
  return [...Array(count).keys()].map((index) =>
    buildReview({
      code: courseCode,
      title: courseTitle,
      review: `Review number ${index + 1}`,
      "review date": `${index + 1}/15/2025 10:00:00`,
    }),
  );
}

function readReviewTexts() {
  return screen.getAllByText(/^Review number/).map((element) => element.textContent);
}

describe("Course page", () => {
  it("renders the course code, title, and tags when the course has reviews", () => {
    renderWithProvider(<Course data={buildMonthlyReviews(2)} courseid={courseCode} />);

    const code = screen.getByText(courseCode);
    const title = screen.getByText(courseTitle);
    const divisionTag = screen.getByText("Upper Division");
    const coreTag = screen.getByText("Core Class");
    expect(code).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(divisionTag).toBeInTheDocument();
    expect(coreTag).toBeInTheDocument();
  });

  it("renders reviews newest first when the course has reviews", () => {
    renderWithProvider(<Course data={buildMonthlyReviews(3)} courseid={courseCode} />);

    const reviewTexts = readReviewTexts();
    expect(reviewTexts).toStrictEqual(["Review number 3", "Review number 2", "Review number 1"]);
  });

  it("renders None in place of reviews when the course has no reviews", () => {
    renderWithProvider(<Course data={[]} courseid={courseCode} />);

    const tipsHeading = screen.getByRole("heading", { name: "Tips from Students" });
    const tipsSection = tipsHeading.parentElement as HTMLElement;
    const placeholder = within(tipsSection).getByText("None");
    const reviewText = within(tipsSection).queryByText(/^Review number/);
    expect(placeholder).toBeInTheDocument();
    expect(reviewText).not.toBeInTheDocument();
  });

  it("renders the ten newest reviews first and the remaining reviews when Next is pressed", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Course data={buildMonthlyReviews(12)} courseid={courseCode} />);

    const firstPageLabel = screen.getByText("Page 1 of 2");
    const firstPageReviews = readReviewTexts();
    expect(firstPageLabel).toBeInTheDocument();
    expect(firstPageReviews).toHaveLength(10);
    expect(firstPageReviews).not.toContain("Review number 2");

    await user.click(screen.getByRole("button", { name: "Next" }));

    const secondPageLabel = screen.getByText("Page 2 of 2");
    const secondPageReviews = readReviewTexts();
    expect(secondPageLabel).toBeInTheDocument();
    expect(secondPageReviews).toStrictEqual(["Review number 2", "Review number 1"]);
  });
});
