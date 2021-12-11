import { useState } from "react";
import Navbar from "../../components/Navbar";
import CourseDetailBody from "../../components/CourseDetailBody";
import Footer from "../../components/Footer";
import DateFilter from "../../components/DateFilter";
import { getCourseData } from "../api/courses";
import type { ICourse } from "../../util/models/course";
import { classList } from "../../classList";

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

    function handleFilter(criteria: Array<string>) {
        const filteredData = courseData.filter((course) => {
            course === course;
        });
        setFilter(filteredData);
    }

    return (
        <>
            <Navbar />
            <DateFilter handleFilter={handleFilter} />
            <CourseDetailBody courseData={filteredData} courseid={courseid} />
            <Footer />
        </>
    );
};

export default Course;
