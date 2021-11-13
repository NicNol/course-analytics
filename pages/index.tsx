import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import CourseList from "../components/CourseList";

const Home: NextPage = () => {
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
            <CourseList filter={filter} />
        </>
    );
};

export default Home;
