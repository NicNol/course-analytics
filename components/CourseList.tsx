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

const CourseList: FC<CourseListProps> = ({ jsonData, filter }) => {
    const { data } = jsonData;

    const sortedCourses = data.sort((a, b) => {
        const key = "name";
        const a_title = a[key].split(" ");
        const a_number = parseInt(a_title[1]);
        const b_title = b[key].split(" ");
        const b_number = parseInt(b_title[1]);
        return a_number - b_number;
    });

    let courseTiles = sortedCourses.map((classSummary: ISummary) => {
        const {
            tags,
            name,
            "review count": reviews,
            "time commitment": time,
            "average difficulty": difficulty,
        } = classSummary;
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
                    Reviews={reviews}
                    Difficulty={difficulty}
                    Time={time}
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
