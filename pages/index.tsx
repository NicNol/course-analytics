import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import CourseList from "../components/CourseList";

const Home: NextPage = () => {
    return (
        <>
            <Navbar />
            <Filter />
            <CourseList />
        </>
    );
};

export default Home;
