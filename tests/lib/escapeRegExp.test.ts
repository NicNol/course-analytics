import { describe, expect, it } from "vitest";
import { escapeRegExp } from "../../lib/escapeRegExp";

describe("escapeRegExp", () => {
  it.each([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"])(
    "returns a pattern that matches only the literal text when the text is %s",
    (specialCharacter) => {
      const pattern = new RegExp(`^${escapeRegExp(specialCharacter)}$`);

      const matchesItself = pattern.test(specialCharacter);
      const matchesOtherText = pattern.test("CS 161");
      expect(matchesItself).toBe(true);
      expect(matchesOtherText).toBe(false);
    },
  );

  it("returns the text unchanged when it has no special characters", () => {
    const escaped = escapeRegExp("CS 161");

    expect(escaped).toBe("CS 161");
  });

  it("returns an empty string when the text is empty", () => {
    const escaped = escapeRegExp("");

    expect(escaped).toBe("");
  });
});
