import React, { FC } from "react";
import { Container, Wrap } from "@chakra-ui/react";
import CourseTile from "./CourseTile";
import { ISummary } from "../util/models/summary";

interface CourseListProps {
    filter: string[];
    jsonData: CourseListJSON;
}

interface CourseListJSON {
    data: ISummary[];
}

interface classObject {
    tags: string[];
    number: string;
    title: string;
}

const CourseList: FC<CourseListProps> = ({ jsonData, filter }) => {
    const { data } = jsonData;
    let courseTiles = data.map((classSummary: ISummary) => {
        const { tags, name } = classSummary;
        let nameArray = name.split(" ");
        const number = nameArray[0] + " " + nameArray[1];
        let title = "";
        for (let i = 3; i < nameArray.length; i++) {
            title += nameArray[i] + " ";
        }

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
export type { CourseListJSON };
