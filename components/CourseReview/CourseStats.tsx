import React, { ChangeEvent, FC, useState } from "react";
import { MdAccessTime, MdExtension, MdFeedback, MdInfo } from "react-icons/md";
import {
  Button,
  Collapsible,
  Flex,
  Heading,
  Icon,
  NativeSelect,
  Separator,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import type { ICourse } from "../../scraper/src/models/course";

interface CourseDetailBodyProps {
  courseData: ICourse[];
}

interface CoursePairings {
  [key: string]: number;
}

interface TimeAvg {
  "0-5 hours": number;
  "6-12 hours": number;
  "13-18 hours": number;
  "18+ hours": number;
}

const CourseStats: FC<CourseDetailBodyProps> = (props) => {
  const { open, onToggle } = useDisclosure();
  const { courseData } = props;
  const [filteredData, setFilter] = useState(courseData);

  function handleFilter(days: number) {
    const filteredData = courseData.filter((course) => {
      const reviewDate = Date.parse(course["review date"]);
      const currentDate = new Date();
      return reviewDate > currentDate.getTime() - days * 1000 * 60 * 60 * 24;
    });
    setFilter(filteredData);
  }

  const timeAvg: TimeAvg = {
    "0-5 hours": 3,
    "6-12 hours": 9,
    "13-18 hours": 15,
    "18+ hours": 21,
  };

  let totalDifficulty = 0;
  let totalHours = 0;
  const totalReviews = filteredData.length;
  for (const course of filteredData) {
    totalDifficulty += parseInt(course.difficulty);
    totalHours += timeAvg[course["time commitment"] as keyof TimeAvg];
  }

  const coursePairings: CoursePairings = {};
  for (const course of filteredData) {
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
  const coursePairs =
    sortedPairings.length === 0
      ? [<Text key="None">None</Text>]
      : sortedPairings.map((pair) => {
          const pairArray = pair.split(" ");
          const courseID = `${pairArray[0]} ${pairArray[1]}`;

          return (
            <Stack
              direction={"row"}
              key={pair}
              align={"baseline"}
              justifyContent={["center", null, null, "flex-start"]}
            >
              <Tooltip showArrow content={pair} positioning={{ placement: "top" }}>
                <Icon as={MdInfo} w={4} h={4} />
              </Tooltip>
              <Text fontWeight={"bold"}>{courseID}:</Text>
              <Text>
                {coursePairings[pair]} {coursePairings[pair] > 1 ? "times" : "time"}
              </Text>
            </Stack>
          );
        });

  const coursePairsCollapse = (
    <>
      {coursePairs.slice(0, 3)}
      {coursePairs.length > 3 ? (
        <>
          <Collapsible.Root open={open}>
            <Collapsible.Content>
              <Stack>{coursePairs.slice(3)}</Stack>
            </Collapsible.Content>
          </Collapsible.Root>
          <Button onClick={onToggle} variant={"solid"} colorPalette={"gray"}>
            {open ? "Show Less" : "Show More"}
          </Button>
        </>
      ) : null}
    </>
  );

  const difficulty = totalDifficulty ? (Math.round((totalDifficulty / totalReviews) * 10) / 10).toFixed(1) : "0.0";
  const timeCommitment = totalHours ? Math.round(totalHours / totalReviews) : 0;

  function handleChangeDateFilter(e: ChangeEvent<HTMLSelectElement>) {
    handleFilter(parseInt(e.target.value));
  }

  return (
    <Stack color={"fg"} w={["100%", null, null, "208px"]} ml={[0, null, null, 4]}>
      <Heading size={"md"} color={"fg"}>
        Data Summary
      </Heading>
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={4}>
        <Text>Filter:</Text>
        <Flex flexGrow={"1"}>
          <NativeSelect.Root w={"100%"} colorPalette={"gray"}>
            <NativeSelect.Field
              onChange={handleChangeDateFilter}
              bg={"bg.panel"}
              color={"fg"}
              borderColor={"border.emphasized"}
            >
              <option value="99999">All Time</option>
              <option value="730">Past 2 Years</option>
              <option value="183">Past 6 Months</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Flex>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdFeedback} w={8} h={8} alignSelf={"flex-end"} mb={1.5} />
        <Text fontSize={"3xl"} fontWeight={"light"} color={"fg"}>
          {totalReviews}
        </Text>
        <Text fontWeight={"bold"}>Reviews</Text>
      </Stack>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdAccessTime} w={8} h={8} alignSelf={"flex-end"} mb={1.5} />
        <Text fontSize={"3xl"} fontWeight={"light"} color={"fg"}>
          {timeCommitment}
        </Text>
        <Text fontWeight={"bold"}> Hours per Week</Text>
      </Stack>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdExtension} w={8} h={8} alignSelf={"flex-end"} mb={1.5} />
        <Text fontSize={"3xl"} fontWeight={"light"} color={"fg"}>
          {difficulty}
        </Text>

        <Text fontWeight={"bold"}>/ 5.0 Difficulty</Text>
      </Stack>
      <Separator w={"full"} />
      <Stack>
        <Heading size={"md"} color={"fg"} textAlign={["center", null, null, "left"]}>
          Common Pairings
        </Heading>
        <Stack>{coursePairsCollapse}</Stack>
      </Stack>
    </Stack>
  );
};

export default CourseStats;
