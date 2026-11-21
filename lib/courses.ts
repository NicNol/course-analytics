import { getReviews } from "./survey";

export async function getCourseData(courseCode: string) {
  if (!courseCode.trim()) throw new Error("A course code is required");
  const search = courseCode.toLowerCase();
  const reviews = await getReviews();
  return reviews.filter(({ code }) => code?.toLowerCase().includes(search));
}
