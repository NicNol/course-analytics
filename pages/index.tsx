import { GetStaticProps } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getSummary } from "../pages/api/summary/index";
import type { CourseListJSON } from "../components/CourseList";
import Filter from "../components/Filter";
import CourseTable from "../components/CourseTable";
import CourseList from "../components/CourseList";
import PageWrapper from "../components/PageWrapper";

export const getStaticProps: GetStaticProps = async (context) => {
    let jsonData = await getSummary();
    /* Reformat to prevent a Next.js error when using getStaticProps */
    jsonData = JSON.parse(JSON.stringify(jsonData));
    return {
        props: { data: jsonData },
        revalidate: 3600, // seconds (1 hour)
    };
};

const Home: NextPage<CourseListJSON> = (jsonData) => {
    const [filter, setFilter] = useState([
        "Lower Division",
        "Core Class",
        "Upper Division",
        "Elective",
    ]);

    function handleFilter(criteria: Array<string>) {
        setFilter(criteria);
    }

    return (
        <>
            <Head>
                <title>Course Analytics</title>
                <meta charSet="UTF-8" />
                <meta
                    name="keywords"
                    content="Oregon State University,Online, Computer Science, Post-Bacc, Course, Analytics, Reviews, Data"
                />
                <meta
                    name="description"
                    content="Course Analytics for Oregon State University's Computer Science Post-Bacc Program"
                />
                <meta name="author" content="Nic Nolan" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Head>
            <PageWrapper>
                <Filter handleFilter={handleFilter} />
                <CourseTable filter={filter} jsonData={jsonData} />
                <CourseList filter={filter} jsonData={jsonData} />
            </PageWrapper>
        </>
    );
};

export default Home;
