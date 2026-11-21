import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CourseTile from "../../components/CourseCard/CourseTile";
import { renderWithProvider } from "../support/renderWithProvider";

const tileProps = {
  tags: ["Lower Division", "Core Class"],
  code: "CS 161",
  title: "Introduction to Computer Science I",
  reviews: "120",
  difficulty: "2.5",
  time: "9",
};

describe("CourseTile", () => {
  it("focuses the details button named for the course when Tab is first pressed", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTile {...tileProps} />);

    await user.tab();

    const detailsButton = screen.getByRole("button", { name: "View Details for CS 161" });
    expect(detailsButton).toHaveFocus();
  });

  it("returns focus to the page when Tab is pressed a second time", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTile {...tileProps} />);

    await user.tab();
    await user.tab();

    expect(document.body).toHaveFocus();
  });

  it.each([tileProps.code, tileProps.title])(
    "renders the link named %j to the course page and keeps it out of the Tab order",
    (linkName) => {
      renderWithProvider(<CourseTile {...tileProps} />);

      const link = screen.getByRole("link", { name: linkName });
      expect(link).toHaveAttribute("href", "/courses/CS-161");
      expect(link).toHaveAttribute("tabindex", "-1");
    },
  );

  it("renders the details button inside a link to the course page that is kept out of the Tab order", () => {
    renderWithProvider(<CourseTile {...tileProps} />);

    const detailsButton = screen.getByRole("button", { name: "View Details for CS 161" });
    const link = detailsButton.closest("a");
    expect(link).toHaveAttribute("href", "/courses/CS-161");
    expect(link).toHaveAttribute("tabindex", "-1");
  });
});
