import { getReviews } from "./survey";
import { summarizeByDate, type ISummaryByDate } from "./summarize";

export async function getSummary(): Promise<ISummaryByDate[]> {
  const reviews = await getReviews();
  return [summarizeByDate(reviews, new Date())];
}
