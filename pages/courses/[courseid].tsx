import { useState } from "react";
import Head from "next/head";
import CourseDetailBody from "../../components/CourseDetailBody";
import DateFilter from "../../components/DateFilter";
import { getCourseData } from "../api/courses";
import type { ICourse } from "../../util/models/course";
import { classList } from "../../classList";
import PageWrapper from "../../components/PageWrapper";
import BackBreadcrumb from "../../components/BackBreadcrumb";

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
        revalidate: 3600, // seconds (1 hour)
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
        <>
            <Head>
                    <title>Course Analytics | {courseid}</title>
                    <meta charSet="UTF-8"/>
                    <meta name="keywords" content="Oregon State University,Online, Computer Science, Post-Bacc, Course, Analytics, Reviews, Data" />
                    <meta name="description" content="Course Analytics for Oregon State University's Computer Science Post-Bacc Program"/>
                    <meta name="author" content="Nic Nolan"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </Head>
            <PageWrapper>
                <BackBreadcrumb />
                <DateFilter handleFilter={handleFilter} />
                <CourseDetailBody courseData={filteredData} courseid={courseid} />
            </PageWrapper>
        </>
    );
};

export default Course;
