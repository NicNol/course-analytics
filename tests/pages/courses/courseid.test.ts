import { describe, expect, it, vi } from "vitest";
import { getStaticPaths, getStaticProps } from "../../../pages/courses/[courseid]";
import { buildReview } from "../../support/fixtures";

const { find } = vi.hoisted(() => ({ find: vi.fn() }));

vi.mock("../../../lib/mongodb", () => ({ connectToDatabase: vi.fn() }));
vi.mock("../../../lib/models/course", () => ({ Course: { find } }));

describe("getStaticPaths", () => {
  it("returns a dashed slug for each course in the class list and 404s other slugs", async () => {
    const { paths, fallback } = await getStaticPaths();

    expect(paths).toContainEqual({ params: { courseid: "CS-374" } });
    expect(paths).toContainEqual({ params: { courseid: "MTH-231" } });
    expect(paths).not.toContainEqual({ params: { courseid: "CS-344" } });
    expect(fallback).toBe(false);
  });
});

describe("getStaticProps", () => {
  it("returns the course reviews and spaced course code when given a dashed slug", async () => {
    const reviews = [buildReview({ code: "CS 374", title: "Operating Systems I" })];
    find.mockResolvedValue(reviews);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(find).toHaveBeenCalledWith({ code: { $regex: "CS 374", $options: "i" } }, { _id: false, versionKey: false });
    expect(result.props).toStrictEqual({ data: reviews, courseid: "CS 374" });
  });

  it("returns a page that regenerates hourly", async () => {
    find.mockResolvedValue([]);

    const result = await getStaticProps({ params: { courseid: "CS-374" } });

    expect(result.revalidate).toBe(3600);
  });
});
