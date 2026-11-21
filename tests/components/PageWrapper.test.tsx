import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageWrapper from "../../components/PageWrapper";
import { renderWithProvider } from "../support/renderWithProvider";

describe("PageWrapper", () => {
  it("renders the page content inside the main landmark", () => {
    renderWithProvider(
      <PageWrapper>
        <p>Course tiles</p>
      </PageWrapper>,
    );

    const main = screen.getByRole("main");
    const content = within(main).getByText("Course tiles");
    expect(content).toBeInTheDocument();
  });

  it("renders the site title as the only level one heading inside the banner landmark", () => {
    renderWithProvider(<PageWrapper>{null}</PageWrapper>);

    const banner = screen.getByRole("banner");
    const pageHeadings = screen.getAllByRole("heading", { level: 1 });
    const title = within(banner).getByRole("heading", { level: 1, name: "Course Analytics" });
    expect(pageHeadings).toStrictEqual([title]);
  });

  it("renders the about text inside the contentinfo landmark", () => {
    renderWithProvider(<PageWrapper>{null}</PageWrapper>);

    const footer = screen.getByRole("contentinfo");
    const aboutHeading = within(footer).getByRole("heading", { name: "About:" });
    expect(aboutHeading).toBeInTheDocument();
  });
});
