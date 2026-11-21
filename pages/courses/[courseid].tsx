import CourseDetailBody from "../../components/CourseReview/CourseDetailBody";
import { getCourseData } from "../../lib/courses";
import type { ICourse } from "../../scraper/src/models/course";
import { classList } from "../../scraper/src/classList";
import PageWrapper from "../../components/PageWrapper";
import BackBreadcrumb from "../../components/CourseReview/BackBreadcrumb";
import PageHead from "../../components/PageHead";

type CourseProps = {
  data: ICourse[];
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
  const courseData = JSON.parse(JSON.stringify(await getCourseData(code)));

  return {
    props: { data: courseData, courseid: code },
    revalidate: 3600, // seconds (1 hour)
  };
};

const Course = ({ data: courseData, courseid }: CourseProps) => {
  return (
    <PageWrapper>
      <PageHead pageTitle={courseid} />
      <BackBreadcrumb />
      <CourseDetailBody courseData={courseData} courseid={courseid} />
    </PageWrapper>
  );
};

export default Course;
