import { useState } from "react";
import Navbar from "../../components/Navbar";
import CourseDetailBody from "../../components/CourseDetailBody";
import Footer from "../../components/Footer";
import DateFilter from "../../components/DateFilter";
import { getCourseData } from "../api/courses";
import type { ICourse } from "../../util/models/course";
import { classList } from "../../classList";
import PageWrapper from "../../components/PageWrapper";

type Params = {
    params: {
        courseid: string;
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
    const { courseid } = params;
    let courseData = await getCourseData(courseid);
    /* Reformat to prevent a Next.js error when using getStaticProps */
    courseData = JSON.parse(JSON.stringify(courseData));
    return {
        props: { data: courseData, courseid: courseid },
    };
};

const Course = (data: any) => {
    const courseData = data.data as ICourse[];
    const courseid = data.courseid;

    const [filteredData, setFilter] = useState([...courseData]);

    function handleFilter(days: number) {
        const filteredData = courseData.filter((course) => {
            const reviewDate = Date.parse(course["review date"]);
            const currentDate = new Date();
            return (
                reviewDate > currentDate.getTime() - days * 1000 * 60 * 60 * 24
            );
        });
        setFilter(filteredData);
    }

    return (
        <PageWrapper>
            <DateFilter handleFilter={handleFilter} />
            <CourseDetailBody courseData={filteredData} courseid={courseid} />
        </PageWrapper>
    );
};

export default Course;
