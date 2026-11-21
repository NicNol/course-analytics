import { getAllCourseData } from "./courses";
import { summarizeByDate, type ISummaryByDate } from "./summarize";

export async function getSummary(): Promise<ISummaryByDate[]> {
  const reviews = await getAllCourseData();
  return [summarizeByDate(reviews, new Date())];
}
