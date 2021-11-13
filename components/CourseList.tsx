import React, { FC } from "react";
import { Container, Wrap } from "@chakra-ui/react";
import CourseTile from "./CourseTile";
import { classList } from "../classList";

interface CourseListProps {
    filter: Array<string>;
}

interface classObject {
    Tags: Array<string>;
    Number: string;
    Title: string;
}

const CourseList: FC<CourseListProps> = ({ filter }) => {
    let courseTiles = classList.map((classObject: classObject) => {
        const { Tags, Number, Title } = classObject;

        let in_filter = false;
        for (const tag of Tags) {
            if (filter.includes(tag)) {
                in_filter = true;
                break;
            }
        }

        if (in_filter) {
            return (
                <CourseTile
                    key={Number}
                    Tags={Tags}
                    Number={Number}
                    Title={Title}
                />
            );
        }
    });

    return (
        <Container maxW="container.xl">
            <Wrap spacing={4} justify="center">
                {courseTiles}
            </Wrap>
        </Container>
    );
};

export default CourseList;
