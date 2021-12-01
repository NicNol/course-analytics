import React, { FC } from "react";
import { Container, Wrap } from "@chakra-ui/react";
import CourseTile from "./CourseTile";
import { classList } from "../classList";

interface CourseListProps {
    filter: Array<string>;
}

interface classObject {
    tags: Array<string>;
    number: string;
    title: string;
}

const CourseList: FC<CourseListProps> = ({ filter }) => {
    let courseTiles = classList.map((classObject: classObject) => {
        const { tags, number, title } = classObject;

        let in_filter = false;
        for (const tag of tags) {
            if (filter.includes(tag)) {
                in_filter = true;
                break;
            }
        }

        if (in_filter) {
            return (
                <CourseTile
                    key={number}
                    Tags={tags}
                    Number={number}
                    Title={title}
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
