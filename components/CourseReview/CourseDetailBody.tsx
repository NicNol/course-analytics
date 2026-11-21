import React, { FC, useState } from "react";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import type { ICourse } from "../../lib/models/course";
import { newestWrittenReviewsFirst, REVIEWS_PER_PAGE, type ReviewStats } from "../../lib/reviews";
import { classList } from "../../lib/classList";
import CourseTag from "../CourseCard/CourseTag";
import CourseReview from "./CourseReview";
import CourseStats from "./CourseStats";
import Pagination from "./Pagination";

interface CourseDetailBodyProps {
  reviewStats: ReviewStats[];
  firstReviews: ICourse[];
  writtenReviewCount: number;
  courseid: string;
}

const CourseDetailBody: FC<CourseDetailBodyProps> = (props) => {
  const { reviewStats, firstReviews, writtenReviewCount, courseid } = props;
  const courseListing = classList.find((course) => course.code === courseid);
  if (!courseListing) throw new Error(`Unknown course ${courseid}`);
  const tipsPerPage = REVIEWS_PER_PAGE;
  const [pageNumber, setPageNumber] = useState(1);
  const [allReviews, setAllReviews] = useState<ICourse[] | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const { tags, title } = courseListing;
  const tagElements = tags.map((tag) => <CourseTag key={courseid + tag}>{tag}</CourseTag>);

  const writtenReviews = allReviews ?? firstReviews;
  const totalTipCount = allReviews?.length ?? writtenReviewCount;
  const reviews =
    writtenReviewCount === 0
      ? [<Text key="none">None</Text>]
      : writtenReviews.map((review, index) => (
          <CourseReview key={`${index}-${review["review date"]}`} courseData={review} />
        ));

  async function loadAllReviews() {
    setIsLoadingReviews(true);
    setLoadFailed(false);
    try {
      const response = await fetch(`/api/courses/${courseid.replace(" ", "-")}`);
      if (!response.ok) throw new Error(`Loading reviews failed with status ${response.status}`);
      const courseData: ICourse[] = await response.json();
      setAllReviews(newestWrittenReviewsFirst(courseData));
      return true;
    } catch {
      setLoadFailed(true);
      return false;
    } finally {
      setIsLoadingReviews(false);
    }
  }

  async function changePage(delta: number) {
    if (allReviews === null && delta > 0) {
      const loaded = await loadAllReviews();
      if (!loaded) return;
    }
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
          <Text textAlign={"center"} fontSize={"5xl"} fontWeight={"extrabold"} color={"fg"} mt={3}>
            {courseid}
          </Text>
        </Box>
        <Flex direction={"column"} align={"center"} justify={"center"} bg={"chrome.bg"} h={16} px={8}>
          <Text textAlign={"center"} color={"chrome.fg"} fontSize={"2xl"} fontWeight={"semibold"}>
            {title}
          </Text>
        </Flex>
        <Flex direction={"column"} bg={"bg.muted"} px={6} py={4}>
          <Flex flexWrap={["wrap", null, null, "nowrap"]} alignItems={"stretch"} justifyContent={"flex-start"} gap={6}>
            <Flex direction={"column"} flexGrow={[1, 1, 1, 0]}>
              <CourseStats courseData={reviewStats} />
            </Flex>
            <Flex direction={"column"} flexGrow={1} maxW={"100%"} w={"100%"} gap={2}>
              <Heading size={"md"} id={"TipsHeader"}>
                Tips from Students
              </Heading>
              {reviews.slice(tipsPerPage * (pageNumber - 1), tipsPerPage * pageNumber)}
              {loadFailed && <Text color={"fg.error"}>Could not load more reviews. Try again.</Text>}
              <Pagination
                pageNumber={pageNumber}
                totalTipCount={totalTipCount}
                tipsPerPage={tipsPerPage}
                isLoading={isLoadingReviews}
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
