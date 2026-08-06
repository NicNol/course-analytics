import React, { FC, useState } from "react";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import type { ICourse } from "../../scraper/src/models/course";
import { classList } from "../../scraper/src/classList";
import CourseTag from "../CourseCard/CourseTag";
import CourseReview from "./CourseReview";
import CourseStats from "./CourseStats";
import Pagination from "./Pagination";

interface CourseDetailBodyProps {
  courseData: ICourse[];
  courseid: string;
}

const CourseDetailBody: FC<CourseDetailBodyProps> = (props) => {
  const { courseData, courseid } = props;
  const CourseListing = classList.filter((course) => course.code === courseid);
  const tipsPerPage = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const { tags, title } = CourseListing[0];
  const tagElements = tags.map((tag) => <CourseTag key={courseid + tag}>{tag}</CourseTag>);

  const sortedReviews = courseData.sort(function (a, b) {
    const dateKey = "review date";
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateA.valueOf() - dateB.valueOf();
  });

  const reviews =
    sortedReviews.length === 0
      ? [<Text key="none">None</Text>]
      : sortedReviews
          .filter((review) => review.review?.length) // remove blanks
          .map((review, index) => <CourseReview key={`${index}-${review["review date"]}`} courseData={review} />)
          .reverse();

  function changePage(delta: number) {
    setPageNumber(pageNumber + delta);
  }

  return (
    <Center p={2}>
      <Flex
        direction={"column"}
        maxW={"content"}
        w={["auto", null, null, "content"]}
        bg={"bg.panel"}
        borderWidth={"1px"}
        borderColor={"border"}
        boxShadow={"lg"}
        rounded={"l3"}
        overflow={"hidden"}
      >
        <Box bg={"colorPalette.muted"} pb={3}>
          <Flex justify={"center"} pt={6} align={"center"} gap={2}>
            {tagElements}
          </Flex>
          <Text textAlign={"center"} fontSize={"5xl"} fontWeight={"extrabold"} color={"fg"} mt={3} data-cy={"CourseNumber"}>
            {courseid}
          </Text>
        </Box>
        <Flex direction={"column"} align={"center"} justify={"center"} bg={"chrome.bg"} h={16} px={8}>
          <Text
            textAlign={"center"}
            color={"chrome.fg"}
            fontSize={"2xl"}
            fontWeight={"semibold"}
            data-cy={"CourseTitle"}
          >
            {title}
          </Text>
        </Flex>
        <Flex direction={"column"} bg={"bg.muted"} px={6} py={4}>
          <Flex flexWrap={["wrap", null, null, "nowrap"]} alignItems={"stretch"} justifyContent={"flex-start"} gap={6}>
            <Flex direction={"column"} flexGrow={[1, 1, 1, 0]} data-cy={"CourseStats"}>
              <CourseStats courseData={courseData} />
            </Flex>
            <Flex direction={"column"} flexGrow={1} data-cy={"CourseReviews"} maxW={"100%"} w={"100%"} gap={2}>
              <Heading size={"md"} id={"TipsHeader"}>
                Tips from Students
              </Heading>
              {reviews.slice(tipsPerPage * (pageNumber - 1), tipsPerPage * pageNumber)}
              <Pagination
                pageNumber={pageNumber}
                totalTipCount={reviews.length}
                tipsPerPage={tipsPerPage}
                changePage={changePage}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
};

export default CourseDetailBody;
