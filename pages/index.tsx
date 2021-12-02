import type { NextPage } from "next";
import { useState } from "react";
import { GetServerSideProps } from "next";
import { getSummary } from "../pages/api/summary/index";
import type { CourseListJSON } from "../components/CourseList";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import CourseList from "../components/CourseList";

export const getServerSideProps: GetServerSideProps = async (context) => {
    let jsonData = await getSummary();
    /* Reformat to prevent a Next.js error when using getServerSideProps */
    jsonData = JSON.parse(JSON.stringify(jsonData));
    return {
        props: { data: jsonData },
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
            <Navbar />
            <Filter handleFilter={handleFilter} />
            <CourseList filter={filter} jsonData={jsonData} />
        </>
    );
};

export default Home;
