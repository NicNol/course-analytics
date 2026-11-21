export interface ICourse {
  code: string;
  title: string;
  difficulty: string;
  "time commitment": string;
  review: string;
  "review date": string;
  quarter: string;
  "other courses": string[];
}

export const REVIEWS_PER_PAGE = 10;

export type ReviewStats = Pick<ICourse, "difficulty" | "time commitment" | "review date" | "other courses">;

export function newestWrittenReviewsFirst(reviews: ICourse[]) {
  return [...reviews]
    .sort((a, b) => new Date(a["review date"]).valueOf() - new Date(b["review date"]).valueOf())
    .filter((review) => review.review?.length)
    .reverse();
}

export function toReviewStats(review: ICourse): ReviewStats {
  return {
    difficulty: review.difficulty,
    "time commitment": review["time commitment"],
    "review date": review["review date"],
    "other courses": review["other courses"],
  };
}
