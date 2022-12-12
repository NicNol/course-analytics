import React, { ChangeEvent, FC, useState } from "react";
import { Center, Flex, Heading, Select, Text, useColorModeValue } from "@chakra-ui/react";
import type { ICourse } from "../../util/models/course";
import { classList } from "../../classList";
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
  const [tipsPerPage, setTipsPerPage] = useState(10);
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

  function handleChangeTipsPerPage(e: ChangeEvent<HTMLSelectElement>) {
    setTipsPerPage(parseInt(e.target.value));
    setPageNumber(1);
  }

  function changePage(delta: number) {
    setPageNumber(pageNumber + delta);
  }

  return (
    <Center p={2}>
      <Flex
        direction={"column"}
        maxW={"1054px"}
        w={["auto", null, null, "1054px"]}
        bg={useColorModeValue("orange.100", "gray.700")}
        boxShadow={"lg"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Flex justify={"center"} pt={6} color={useColorModeValue("gray.800", "white")} align={"center"} gap={2}>
          {tagElements}
        </Flex>
        <Text
          align={"center"}
          fontSize={"5xl"}
          fontWeight={800}
          textShadow={useColorModeValue("2px 2px #eee", "2px 2px #333")}
          data-cy={"CourseNumber"}
        >
          {courseid}
        </Text>
        <Flex
          direction={"column"}
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
            color={useColorModeValue("white", "black")}
            fontSize={"2xl"}
            fontWeight={"600"}
            lineHeight={".75"}
            data-cy={"CourseTitle"}
          >
            {title}
          </Text>
        </Flex>
        <Flex direction={"column"} bg={useColorModeValue("#f5f5f5", "gray.900")} px={2} py={4}>
          <Flex flexWrap={["wrap", null, null, "nowrap"]} alignItems={"stretch"} justifyContent={"flex-start"} gap={6}>
            <Flex direction={"column"} mt={[0, null, null, 2]} flexGrow={[1, 1, 1, 0]} data-cy={"CourseStats"}>
              <CourseStats courseData={courseData} />
            </Flex>
            <Flex direction={"column"} flexGrow={1} data-cy={"CourseReviews"} maxW={"100%"} w={"100%"} gap={2}>
              <Flex justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"} gap={1}>
                <Heading size={"md"} mt={[2, null, null, 0]} id={"TipsHeader"}>
                  Tips from Students
                </Heading>
                <Select w={48} onChange={handleChangeTipsPerPage}>
                  <option value="10">10 Tips per Page</option>
                  <option value="25">25 Tips per Page</option>
                  <option value="100">100 Tips per Page</option>
                </Select>
              </Flex>
              <Pagination
                pageNumber={pageNumber}
                totalTipCount={reviews.length}
                tipsPerPage={tipsPerPage}
                changePage={changePage}
              />
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
