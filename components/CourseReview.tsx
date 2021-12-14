import React, { FC } from "react";
import {
    Avatar,
    Box,
    Flex,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import type { ICourse } from "../util/models/course";
import {
    MdAccessTime,
    MdCalendarToday,
    MdExtension,
    MdMode,
} from "react-icons/md";

interface CourseReviewProps {
    courseData: ICourse;
}

const CourseReview: FC<CourseReviewProps> = ({ courseData }) => {
    const {
        review,
        difficulty,
        "time commitment": timeCommitment,
        quarter,
        "other courses": otherCourses,
        "review date": reviewDate,
    } = courseData;

    const formattedReviewDate = new Date(reviewDate);

    return (
        <Box
            bg={useColorModeValue("orange.50", "gray.600")}
            p={2}
            px={3}
            rounded={"md"}
        >
            <Flex gridGap={4}>
                <Avatar mt={1} />
                <Box width={"100%"}>
                    <Flex gridGap={2} pb={2}>
                        <Tag>
                            <TagLeftIcon as={MdCalendarToday} />
                            <TagLabel>{quarter}</TagLabel>
                        </Tag>
                        <Tag>
                            <TagLeftIcon as={MdAccessTime} />
                            <TagLabel>{timeCommitment}/week</TagLabel>
                        </Tag>
                        <Tag>
                            <TagLeftIcon as={MdExtension} />
                            <TagLabel>{difficulty} / 5 </TagLabel>
                        </Tag>
                        {otherCourses.map((course) => {
                            const courseName = course.split(" ");
                            return (
                                <Tag key={reviewDate + course}>
                                    <TagLeftIcon as={MdMode} />
                                    <TagLabel>{`${courseName[0]} ${courseName[1]}`}</TagLabel>
                                </Tag>
                            );
                        })}
                    </Flex>

                    <Text fontSize={"sm"} textAlign={"left"} mb={2}>
                        {review}
                    </Text>
                    <Text
                        fontSize={"sm"}
                        textAlign={"right"}
                        fontStyle={"italic"}
                        opacity={"60%"}
                    >
                        Submitted {formattedReviewDate.toDateString()}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default CourseReview;
