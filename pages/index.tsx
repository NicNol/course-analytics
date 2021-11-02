import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
//import Navbar from "../components/navbar";
import Navbar2 from "../components/Navbar2";
import Filter from "../components/Filter";

const Home: NextPage = () => {
    return (
        <>
            <Navbar2 />
            <Filter />
        </>
    );
};

export default Home;
