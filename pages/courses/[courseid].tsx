import CourseDetailBody from "../../components/CourseReview/CourseDetailBody";
import { getCourseData } from "../../lib/courses";
import {
  newestWrittenReviewsFirst,
  REVIEWS_PER_PAGE,
  toReviewStats,
  type ICourse,
  type ReviewStats,
} from "../../lib/reviews";
import { classList } from "../../lib/classList";
import PageWrapper from "../../components/PageWrapper";
import BackBreadcrumb from "../../components/CourseReview/BackBreadcrumb";
import PageHead from "../../components/PageHead";

type CourseProps = {
  reviewStats: ReviewStats[];
  firstReviews: ICourse[];
  writtenReviewCount: number;
  courseid: string;
};

type Params = {
  params: {
    courseid: string;
  };
};

export const getStaticPaths = async () => {
  const coursePaths = [];
  for (const course of classList) {
    const coursePath = {
      params: { courseid: course.code.replace(" ", "-") }, // slugify course code
    };
    coursePaths.push(coursePath);
  }

  return {
    paths: coursePaths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: Params): Promise<{ props: CourseProps; revalidate: number }> => {
  const { courseid } = params;
  const code = courseid.replace("-", " ");

  /* Reformat to prevent a Next.js error when using getStaticProps */
  const courseData: ICourse[] = JSON.parse(JSON.stringify(await getCourseData(code)));
  const writtenReviews = newestWrittenReviewsFirst(courseData);

  return {
    props: {
      reviewStats: courseData.map(toReviewStats),
      firstReviews: writtenReviews.slice(0, REVIEWS_PER_PAGE),
      writtenReviewCount: writtenReviews.length,
      courseid: code,
    },
    revalidate: 3600, // seconds (1 hour)
  };
};

const Course = ({ reviewStats, firstReviews, writtenReviewCount, courseid }: CourseProps) => {
  return (
    <PageWrapper>
      <PageHead pageTitle={courseid} />
      <BackBreadcrumb />
      <CourseDetailBody
        reviewStats={reviewStats}
        firstReviews={firstReviews}
        writtenReviewCount={writtenReviewCount}
        courseid={courseid}
      />
    </PageWrapper>
  );
};

export default Course;
