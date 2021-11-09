import React, { FC } from "react";
import { Container, Wrap } from "@chakra-ui/react";
import CourseTile from "./CourseTile";
import { classList } from "../classList";

interface CourseListProps {}

interface classObject {
    Tags: Array<string>;
    Number: string;
    Title: string;
}

let courseTiles = classList.map((classObject: classObject) => {
    const { Tags, Number, Title } = classObject;
    return (
        <CourseTile key={Number} Tags={Tags} Number={Number} Title={Title} />
    );
});

const CourseList: FC<CourseListProps> = ({}) => {
    return (
        <Container maxW="container.xl">
            <Wrap spacing={4} justify="center">
                {courseTiles}
            </Wrap>
        </Container>
    );
};

export default CourseList;
