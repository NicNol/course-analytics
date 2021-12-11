import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import CourseDetailBody from "../../components/CourseDetailBody";
import Footer from "../../components/Footer";
import { getCourseData } from "../api/courses";
import type { ICourse } from "../../util/models/course";
import { classList } from "../../classList";

type Params = {
    params: {
        slug: string;
    };
};

export const getStaticPaths = async () => {
    let coursePaths = [];
    for (const course of classList) {
        const coursePath = {
            params: { courseid: course.number },
        };
        coursePaths.push(coursePath);
    }

    return {
        paths: coursePaths,
        fallback: false,
    };
};

export const getStaticProps = async ({ params }: Params) => {
    const { slug } = params;
    let courseData = getCourseData(slug);
    /* Reformat to prevent a Next.js error when using getStaticProps */
    courseData = JSON.parse(JSON.stringify(courseData));
    return {
        props: { data: courseData },
    };
};

const Course = (courseData: ICourse[]) => {
    const router = useRouter();
    const { courseid } = router.query;

    return (
        <>
            <Navbar />
            <h1>Course: {courseData.length}</h1>
            <CourseDetailBody />
            <Footer />
        </>
    );
};

export default Course;
