import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageWrapper from "../../components/PageWrapper";
import { renderWithProvider } from "../support/renderWithProvider";

const pageContent = <p>Course tiles</p>;

function renderPage() {
  renderWithProvider(<PageWrapper>{pageContent}</PageWrapper>);
}

describe("PageWrapper", () => {
  it("renders the page content inside the main landmark", () => {
    renderPage();

    const main = screen.getByRole("main");
    const content = within(main).getByText("Course tiles");
    expect(content).toBeInTheDocument();
  });

  it("renders the site title as a level one heading inside the banner landmark", () => {
    renderPage();

    const banner = screen.getByRole("banner");
    const title = within(banner).getByRole("heading", { level: 1, name: "Course Analytics" });
    expect(title).toBeInTheDocument();
  });

  it("renders no level one heading besides the site title", () => {
    renderPage();

    const levelOneHeadings = screen.getAllByRole("heading", { level: 1 });
    expect(levelOneHeadings).toHaveLength(1);
  });

  it("renders the About heading inside the contentinfo landmark", () => {
    renderPage();

    const footer = screen.getByRole("contentinfo");
    const aboutHeading = within(footer).getByRole("heading", { name: "About:" });
    expect(aboutHeading).toBeInTheDocument();
  });
});
