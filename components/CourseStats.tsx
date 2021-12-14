import React, { FC } from "react";
import {
    MdAccessTime,
    MdExtension,
    MdFeedback,
    MdInfo,
    MdMode,
} from "react-icons/md";
import {
    Box,
    Divider,
    Heading,
    Icon,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
} from "@chakra-ui/react";
import type { ICourse } from "../util/models/course";

interface CourseDetailBodyProps {
    courseData: ICourse[];
}

interface CoursePairings {
    [key: string]: number;
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

    const coursePairings: CoursePairings = {};
    for (const course of courseData) {
        for (const pairing of course["other courses"]) {
            if (!coursePairings.hasOwnProperty(pairing)) {
                coursePairings[pairing] = 0;
            }
            coursePairings[pairing] += 1;
        }
    }
    const sortedPairings = Object.keys(coursePairings).sort(function (a, b) {
        return coursePairings[b] - coursePairings[a];
    });
    const coursePairs = sortedPairings.map((pair) => {
        const pairArray = pair.split(" ");
        const courseID = `${pairArray[0]} ${pairArray[1]}`;

        return (
            <Stack
                direction={"row"}
                key={pair}
                align={"baseline"}
                justifyContent={["center", null, null, "flex-start"]}
            >
                <Tooltip
                    hasArrow
                    label={pair}
                    placement="top"
                    shouldWrapChildren
                >
                    <Icon as={MdInfo} w={4} h={4} />
                </Tooltip>
                <Text fontWeight={"bold"}>{courseID}:</Text>
                <Text>{coursePairings[pair]} times</Text>
            </Stack>
        );
    });

    const difficulty = Math.round((totalDifficulty / totalReviews) * 10) / 10;
    const timeCommitment = Math.round(totalHours / totalReviews);

    return (
        <Stack
            color={useColorModeValue("#333", "#ccc")}
            w={["100%", null, null, 56]}
        >
            <Stack
                direction={"row"}
                justifyContent={["center", null, null, "flex-start"]}
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
            <Stack
                direction={"row"}
                justifyContent={["center", null, null, "flex-start"]}
                align={"baseline"}
            >
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
                justifyContent={["center", null, null, "flex-start"]}
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
                    {difficulty.toFixed(1)}
                </Text>

                <Text fontWeight={"700"}>/ 5.0 Difficulty</Text>
            </Stack>
            <Divider w={["auto", null, null, 48]} />
            <Stack>
                <Stack
                    direction={"row"}
                    justifyContent={["center", null, null, "flex-start"]}
                    align={"baseline"}
                >
                    <Icon
                        as={MdMode}
                        w={8}
                        h={8}
                        pos={"relative"}
                        top={"3px"}
                    />
                    <Heading size={"md"} textAlign={"left"}>
                        Common Pairings
                    </Heading>
                </Stack>
                <Stack pl={[0, null, null, 6]}>{coursePairs}</Stack>
                <Divider w={["auto", null, null, 48]} />
            </Stack>
        </Stack>
    );
};

export default CourseStats;
