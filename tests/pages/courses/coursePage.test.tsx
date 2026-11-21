import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ICourse } from "../../../lib/models/course";
import Course from "../../../pages/courses/[courseid]";
import { buildMonthlyReviews, buildReview } from "../../support/fixtures";
import { renderWithProvider } from "../../support/renderWithProvider";

const courseCode = "CS 374";
const courseTitle = "Operating Systems I";
const reviewsEndpoint = "/api/courses/CS-374";
const loadFailureMessage = "Could not load more reviews. Try again.";

function newestReviewTexts(totalCount: number, pageSize: number) {
  return [...Array(pageSize).keys()].map((index) => `Review number ${totalCount - index}`);
}

function readReviewTexts() {
  return screen.getAllByText(/^Review number/).map((element) => element.textContent);
}

function renderCoursePage(reviews: ICourse[]) {
  const writtenReviews = reviews.filter(({ review }) => review.length > 0);
  const firstReviews = [...writtenReviews].reverse().slice(0, 10);
  renderWithProvider(
    <Course
      reviewStats={reviews}
      firstReviews={firstReviews}
      writtenReviewCount={writtenReviews.length}
      courseid={courseCode}
    />,
  );
}

function mockReviewsEndpoint(reviews: ICourse[]) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(reviews));
}

describe("Course page", () => {
  it("renders the course code, title, and tags when the course has reviews", () => {
    renderCoursePage(buildMonthlyReviews(2));

    const code = screen.getByText(courseCode);
    const title = screen.getByText(courseTitle);
    const divisionTag = screen.getByText("Upper Division");
    const coreTag = screen.getByText("Core Class");
    expect(code).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(divisionTag).toBeInTheDocument();
    expect(coreTag).toBeInTheDocument();
  });

  it("renders the ten newest reviews without requesting more when the page loads", () => {
    const fetchSpy = mockReviewsEndpoint([]);

    renderCoursePage(buildMonthlyReviews(12));

    const reviewTexts = readReviewTexts();
    expect(reviewTexts).toStrictEqual(newestReviewTexts(12, 10));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("renders the review count of the whole course when only the first page of reviews is loaded", () => {
    renderCoursePage(buildMonthlyReviews(12));

    const reviewCount = screen.getByText("12");
    expect(reviewCount).toBeInTheDocument();
  });

  it("renders None in place of reviews when the course has no reviews", () => {
    renderCoursePage([]);

    const tipsHeading = screen.getByRole("heading", { name: "Tips from Students" });
    const tipsSection = tipsHeading.parentElement as HTMLElement;
    const placeholder = within(tipsSection).getByText("None");
    const reviewText = within(tipsSection).queryByText(/^Review number/);
    expect(placeholder).toBeInTheDocument();
    expect(reviewText).not.toBeInTheDocument();
  });

  it("renders None in place of reviews when every review of the course is blank", () => {
    const blankReview = buildReview({ review: "", "review date": "3/15/2025 10:00:00" });

    renderCoursePage([blankReview]);

    const tipsHeading = screen.getByRole("heading", { name: "Tips from Students" });
    const tipsSection = tipsHeading.parentElement as HTMLElement;
    const placeholder = within(tipsSection).getByText("None");
    expect(placeholder).toBeInTheDocument();
  });

  it("disables Previous and Next when the course has no reviews", () => {
    renderCoursePage([]);

    const previous = screen.getByRole("button", { name: "Previous" });
    const next = screen.getByRole("button", { name: "Next" });
    expect(previous).toBeDisabled();
    expect(next).toBeDisabled();
  });

  it("renders only reviews with text when the course has blank reviews", () => {
    const blankReview = buildReview({ review: "", "review date": "3/15/2025 10:00:00" });

    renderCoursePage([...buildMonthlyReviews(2), blankReview]);

    const submissionDates = screen.getAllByText(/^Submitted/);
    const reviewTexts = readReviewTexts();
    expect(submissionDates).toHaveLength(2);
    expect(reviewTexts).toStrictEqual(["Review number 2", "Review number 1"]);
  });

  it("requests the reviews of the course once when Next is pressed for the first time", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(25);
    const fetchSpy = mockReviewsEndpoint(reviews);
    renderCoursePage(reviews);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByText("Page 2 of 3");
    await user.click(screen.getByRole("button", { name: "Previous" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(reviewsEndpoint);
  });

  it("renders the remaining reviews newest first when Next is pressed", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(12);
    const reviewsInStoredOrder = [...reviews.slice(6), ...reviews.slice(0, 6)];
    mockReviewsEndpoint(reviewsInStoredOrder);
    renderCoursePage(reviews);

    await user.click(screen.getByRole("button", { name: "Next" }));

    const secondPageLabel = await screen.findByText("Page 2 of 2");
    const secondPageReviews = readReviewTexts();
    expect(secondPageLabel).toBeInTheDocument();
    expect(secondPageReviews).toStrictEqual(["Review number 2", "Review number 1"]);
  });

  it("renders a page count without blank reviews when the fetched reviews include blank ones", async () => {
    const user = userEvent.setup();
    const blankReviews = [...Array(9).keys()].map((index) =>
      buildReview({ review: "", "review date": `${index + 1}/20/2025 10:00:00` }),
    );
    const reviews = [...buildMonthlyReviews(12), ...blankReviews];
    mockReviewsEndpoint(reviews);
    renderCoursePage(reviews);

    await user.click(screen.getByRole("button", { name: "Next" }));

    const secondPageLabel = await screen.findByText("Page 2 of 2");
    expect(secondPageLabel).toBeInTheDocument();
  });

  it("renders the page count of the fetched reviews when the course gained reviews since the page was built", async () => {
    const user = userEvent.setup();
    renderCoursePage(buildMonthlyReviews(12));
    mockReviewsEndpoint(buildMonthlyReviews(25));

    await user.click(screen.getByRole("button", { name: "Next" }));

    const secondPageLabel = await screen.findByText("Page 2 of 3");
    expect(secondPageLabel).toBeInTheDocument();
  });

  it("renders the first page of reviews when Previous is pressed on the second page", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(12);
    mockReviewsEndpoint(reviews);
    renderCoursePage(reviews);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByText("Page 2 of 2");

    await user.click(screen.getByRole("button", { name: "Previous" }));

    const pageLabel = screen.getByText("Page 1 of 2");
    const reviewTexts = readReviewTexts();
    expect(pageLabel).toBeInTheDocument();
    expect(reviewTexts).toStrictEqual(newestReviewTexts(12, 10));
  });

  it("disables Previous on the first page and Next on the last page", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(12);
    mockReviewsEndpoint(reviews);
    renderCoursePage(reviews);

    const previousOnFirstPage = screen.getByRole("button", { name: "Previous" });
    const nextOnFirstPage = screen.getByRole("button", { name: "Next" });
    expect(previousOnFirstPage).toBeDisabled();
    expect(nextOnFirstPage).toBeEnabled();

    await user.click(nextOnFirstPage);
    await screen.findByText("Page 2 of 2");

    const previousOnLastPage = screen.getByRole("button", { name: "Previous" });
    const nextOnLastPage = screen.getByRole("button", { name: "Next" });
    expect(previousOnLastPage).toBeEnabled();
    expect(nextOnLastPage).toBeDisabled();
  });

  it("disables Next while the reviews are loading", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(12);
    let respond: (response: Response) => void = () => undefined;
    const pendingResponse = new Promise<Response>((resolve) => {
      respond = resolve;
    });
    vi.spyOn(globalThis, "fetch").mockReturnValue(pendingResponse);
    renderCoursePage(reviews);

    await user.click(screen.getByRole("button", { name: "Next" }));

    const nextButton = screen.getByText("Next").closest("button");
    expect(nextButton).toBeDisabled();
    respond(Response.json(reviews));
    await screen.findByText("Page 2 of 2");
  });

  it.each([
    { scenario: "the request fails", respond: () => Promise.reject(new Error("offline")) },
    { scenario: "the server responds with an error", respond: async () => Response.json([], { status: 500 }) },
  ])("renders a failure message and stays on the first page when $scenario", async ({ respond }) => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockImplementation(respond);
    renderCoursePage(buildMonthlyReviews(12));

    await user.click(screen.getByRole("button", { name: "Next" }));

    const failureMessage = await screen.findByText(loadFailureMessage);
    const pageLabel = screen.getByText("Page 1 of 2");
    expect(failureMessage).toBeInTheDocument();
    expect(pageLabel).toBeInTheDocument();
  });

  it("renders the second page and no failure message when Next is pressed again after a failure", async () => {
    const user = userEvent.setup();
    const reviews = buildMonthlyReviews(12);
    vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementation(async () => Response.json(reviews));
    renderCoursePage(reviews);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByText(loadFailureMessage);

    await user.click(screen.getByRole("button", { name: "Next" }));

    const pageLabel = await screen.findByText("Page 2 of 2");
    const failureMessage = screen.queryByText(loadFailureMessage);
    expect(pageLabel).toBeInTheDocument();
    expect(failureMessage).not.toBeInTheDocument();
  });
});
