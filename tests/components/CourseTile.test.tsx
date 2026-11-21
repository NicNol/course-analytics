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
  it("sends the first Tab press to the details button named for the course", async () => {
    const user = userEvent.setup();
    renderWithProvider(<CourseTile {...tileProps} />);

    await user.tab();

    const detailsButton = screen.getByRole("button", { name: "View Details for CS 161" });
    expect(detailsButton).toHaveFocus();
  });

  it("renders the code, the title and the button as links to the course page that Tab skips", () => {
    renderWithProvider(<CourseTile {...tileProps} />);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    const tabIndexes = links.map((link) => link.getAttribute("tabindex"));
    expect(hrefs).toStrictEqual(["/courses/CS-161", "/courses/CS-161", "/courses/CS-161"]);
    expect(tabIndexes).toStrictEqual(["-1", "-1", "-1"]);
  });
});
