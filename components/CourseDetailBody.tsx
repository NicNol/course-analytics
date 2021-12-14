import React, { FC } from "react";
import {
    Box,
    Center,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    Flex,
} from "@chakra-ui/react";
import type { ICourse } from "../util/models/course";
import { classList } from "../classList";
import CourseTag from "./CourseTag";
import CourseReview from "./CourseReview";
import CourseStats from "./CourseStats";

interface CourseDetailBodyProps {
    courseData: ICourse[];
    courseid: string;
}

const CourseDetailBody: FC<CourseDetailBodyProps> = (props) => {
    const { courseData, courseid } = props;
    const CourseListing = classList.filter(
        (course) => course.number === courseid
    );

    const { tags, title } = CourseListing[0];
    const tagElements = tags.map((tag) => (
        <CourseTag key={courseid + tag}>{tag}</CourseTag>
    ));

    const sortedCourses = courseData.sort(function (a, b) {
        const dateKey = "review date";
        const dateA = new Date(a[dateKey]);
        const dateB = new Date(b[dateKey]);
        return dateA.valueOf() - dateB.valueOf();
    });

    const reviews = sortedCourses
        .map((course) => {
            if (course.review?.length > 0) {
                return (
                    <CourseReview
                        key={course["review date"]}
                        courseData={course}
                    />
                );
            }
        })
        .reverse();

    return (
        <Center p={2}>
            <Box
                maxW={"1054px"}
                w={["auto"]}
                bg={useColorModeValue("orange.100", "gray.700")}
                boxShadow={"2xl"}
                rounded={"md"}
                overflow={"auto"}
            >
                <Stack
                    justify={"center"}
                    pt={6}
                    color={useColorModeValue("gray.800", "white")}
                    align={"center"}
                    direction={"row"}
                >
                    {tagElements}
                </Stack>
                <Text
                    align={"center"}
                    justify={"center"}
                    fontSize={"5xl"}
                    fontWeight={800}
                    textShadow={useColorModeValue(
                        "2px 2px #eee",
                        "2px 2px #333"
                    )}
                >
                    {courseid}
                </Text>
                <Stack
                    align={"center"}
                    justify={"center"}
                    bg={useColorModeValue(
                        "rgb(68,68,68) linear-gradient(0deg, rgba(68,68,68,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(68,68,68,1) 100%)",
                        "rgb(160,174,192) linear-gradient(0deg, rgba(160,174,192,1) 0%, rgba(203,213,224,1) 10%, rgba(203,213,224,1) 90%, rgba(160,174,192,1) 100%)"
                    )}
                    h="64px"
                    px={8}
                >
                    <Text
                        align={"center"}
                        justify={"center"}
                        color={useColorModeValue("white", "black")}
                        fontSize={"2xl"}
                        fontWeight={"600"}
                        lineHeight={".75"}
                    >
                        {title
                            .toLowerCase()
                            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                                letter.toUpperCase()
                            )}
                    </Text>
                </Stack>
                <Box
                    bg={useColorModeValue("#f5f5f5", "gray.900")}
                    px={6}
                    py={4}
                    align={"center"}
                >
                    <Flex
                        flexWrap={["wrap", null, null, "nowrap"]}
                        alignItems={"stretch"}
                    >
                        <Stack mt={[0, null, null, 12]} w={"100%"}>
                            <CourseStats courseData={courseData} />
                        </Stack>
                        <Stack>
                            <Heading size={"lg"} mt={[2, null, null, 0]}>
                                Tips from Students
                            </Heading>
                            {reviews}
                        </Stack>
                    </Flex>
                </Box>
            </Box>
        </Center>
    );
};

export default CourseDetailBody;
