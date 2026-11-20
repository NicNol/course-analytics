import { describe, expect, it } from "vitest";
import { classList } from "../../scraper/src/classList";

const DIVISION_TAGS = ["Lower Division", "Upper Division"];
const REQUIREMENT_TAGS = ["Core Class", "Elective"];
const FIRST_UPPER_DIVISION_NUMBER = 300;

function divisionTagFor(code: string) {
  const courseNumber = Number(code.split(" ")[1]);
  return courseNumber < FIRST_UPPER_DIVISION_NUMBER ? "Lower Division" : "Upper Division";
}

describe("classList", () => {
  it("has no duplicate course codes", () => {
    const codes = classList.map(({ code }) => code);
    const uniqueCodes = new Set(codes);

    expect(uniqueCodes.size).toBe(codes.length);
  });

  it.each(classList)("$code has the division tag for its course number and one requirement tag", ({ code, tags }) => {
    const divisionTags = tags.filter((tag) => DIVISION_TAGS.includes(tag));
    const requirementTags = tags.filter((tag) => REQUIREMENT_TAGS.includes(tag));

    expect(tags).toHaveLength(2);
    expect(divisionTags).toStrictEqual([divisionTagFor(code)]);
    expect(requirementTags).toHaveLength(1);
  });
});
