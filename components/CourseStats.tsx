import React, { FC } from "react";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";
import { Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import type { ICourse } from "../util/models/course";

interface CourseDetailBodyProps {
    courseData: ICourse[];
}

interface TimeAvg {
    "0-5 hours": Number;
    "6-12 hours": Number;
    "13-18 hours": Number;
    "18+ hours": Number;
}

const CourseStats: FC<CourseDetailBodyProps> = (props) => {
    const { courseData } = props;
    const timeAvg: TimeAvg = {
        "0-5 hours": 3,
        "6-12 hours": 9,
        "13-18 hours": 15,
        "18+ hours": 21,
    };

    let totalDifficulty = 0;
    let totalHours = 0;
    const totalReviews = courseData.length;
    for (const course of courseData) {
        totalDifficulty += parseInt(course.difficulty);
        totalHours += (timeAvg as any)[course["time commitment"]];
    }

    const difficulty = Math.round((totalDifficulty / totalReviews) * 10) / 10;
    const timeCommitment = Math.round(totalHours / totalReviews);

    return (
        <Stack color={useColorModeValue("#333", "#ccc")} w={56}>
            <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                align={"baseline"}
            >
                <Icon
                    as={MdFeedback}
                    w={8}
                    h={8}
                    pos={"relative"}
                    top={"8px"}
                />
                <Text fontSize={"3xl"} fontWeight={"100"}>
                    {totalReviews}
                </Text>
                <Text fontWeight={"700"}>Reviews</Text>
            </Stack>
            <Stack direction={"row"} justify={"flex-start"} align={"baseline"}>
                <Icon
                    as={MdAccessTime}
                    w={8}
                    h={8}
                    pos={"relative"}
                    top={"5px"}
                />
                <Text fontSize={"3xl"} fontWeight={"100"}>
                    {timeCommitment}
                </Text>
                <Text fontWeight={"700"}> Hours per Week</Text>
            </Stack>
            <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                align={"baseline"}
            >
                <Icon
                    as={MdExtension}
                    w={8}
                    h={8}
                    pos={"relative"}
                    top={"3px"}
                />
                <Text fontSize={"3xl"} fontWeight={"100"}>
                    {difficulty}
                </Text>

                <Text fontWeight={"700"}>/ 5.0 Difficulty</Text>
            </Stack>
        </Stack>
    );
};

export default CourseStats;
