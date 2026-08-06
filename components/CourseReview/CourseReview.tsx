import React, { FC } from "react";
import { Avatar, Box, Flex, Tag, Text, useMediaQuery } from "@chakra-ui/react";
import type { ICourse } from "../../scraper/src/models/course";
import { MdAccessTime, MdCalendarToday, MdExtension, MdMode } from "react-icons/md";

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

  // Use max-width instead of min-width because layout shift is visible on desktop but not mobile
  const [isNarrowerThan400px] = useMediaQuery(["(max-width: 400px)"]);

  return (
    <Box
      bg={"orange.subtle"}
      colorPalette={"gray"}
      borderWidth={"1px"}
      borderColor={"border"}
      p={2}
      px={3}
      rounded={"l3"}
      maxW={"100%"}
    >
      <Flex gap={4} maxW={"100%"}>
        {!isNarrowerThan400px && (
          <Avatar.Root mt={1}>
            <Avatar.Fallback />
          </Avatar.Root>
        )}
        <Box maxW={"100%"} w={"100%"}>
          <Flex gap={2} pb={2} flexWrap={"wrap"} maxW={"100%"}>
            <Tag.Root bg={"gray.muted"}>
              <Tag.StartElement asChild>
                <MdCalendarToday />
              </Tag.StartElement>
              <Tag.Label>{quarter}</Tag.Label>
            </Tag.Root>
            <Tag.Root bg={"gray.muted"}>
              <Tag.StartElement asChild>
                <MdAccessTime />
              </Tag.StartElement>
              <Tag.Label>{timeCommitment}/week</Tag.Label>
            </Tag.Root>
            <Tag.Root bg={"gray.muted"}>
              <Tag.StartElement asChild>
                <MdExtension />
              </Tag.StartElement>
              <Tag.Label>{difficulty} / 5 </Tag.Label>
            </Tag.Root>
            {otherCourses.map((course) => {
              const courseName = course.split(" ");
              return (
                <Tag.Root key={reviewDate + course} bg={"gray.muted"}>
                  <Tag.StartElement asChild>
                    <MdMode />
                  </Tag.StartElement>
                  <Tag.Label>{`${courseName[0]} ${courseName[1]}`}</Tag.Label>
                </Tag.Root>
              );
            })}
          </Flex>

          <Text
            fontSize={"sm"}
            textAlign={"left"}
            mb={2}
            overflowWrap={"anywhere"}
            wordBreak={"break-word"}
            whiteSpace={"pre-line"}
          >
            {review}
          </Text>
          <Text fontSize={"sm"} textAlign={"right"} fontStyle={"italic"} color={"fg.muted"}>
            Submitted {formattedReviewDate.toDateString()}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default CourseReview;
