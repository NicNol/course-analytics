import React, { FC } from "react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
    return (
        <nav>
            <h1>Course Analyzer</h1>
            <h2>
                for Oregon State University&apos;s Computer Science Post-Bacc
                Program
            </h2>
        </nav>
    );
};

export default Navbar;
