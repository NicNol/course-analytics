import React, { ChangeEvent, FC, useState } from "react";
import { MdAccessTime, MdExtension, MdFeedback, MdInfo, MdMode } from "react-icons/md";
import {
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  Icon,
  Select,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { ICourse } from "../../util/models/course";

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
  const { isOpen, onToggle } = useDisclosure();
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
    totalHours += (timeAvg as any)[course["time commitment"]];
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
              <Tooltip hasArrow label={pair} placement="top" shouldWrapChildren>
                <Icon as={MdInfo} w={4} h={4} />
              </Tooltip>
              <Text fontWeight={"bold"}>{courseID}:</Text>
              <Text>
                {coursePairings[pair]} {coursePairings[pair] > 1 ? "times" : "time"}
              </Text>
            </Stack>
          );
        });

  const buttonHoverColor = useColorModeValue("orange.400", "blue.200");
  const coursePairsCollapse = (
    <>
      {coursePairs.slice(0, 3)}
      {coursePairs.length > 3 ? (
        <>
          <Collapse in={isOpen} animateOpacity>
            <Stack>{coursePairs.slice(3)}</Stack>
          </Collapse>
          <Button onClick={onToggle} variant={"link"} _focus={{ outline: "none" }} _hover={{ color: buttonHoverColor }}>
            {isOpen ? "Show Less" : "Show More"}
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
    <Stack color={useColorModeValue("#333", "#ccc")} w={["100%", null, null, "208px"]} ml={[0, null, null, 4]}>
      <Heading size={"md"} pb={2}>
        Data Summary
      </Heading>
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={4}>
        <Text>Filter:</Text>
        <Flex flexGrow={"1"}>
          <Select onChange={handleChangeDateFilter} w={"100%"}>
            <option value="99999">All Time</option>
            <option value="730">Past 2 Years</option>
            <option value="183">Past 6 Months</option>
          </Select>
        </Flex>
      </Flex>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdFeedback} w={8} h={8} pos={"relative"} top={"8px"} />
        <Text fontSize={"3xl"} fontWeight={"100"}>
          {totalReviews}
        </Text>
        <Text fontWeight={"700"}>Reviews</Text>
      </Stack>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdAccessTime} w={8} h={8} pos={"relative"} top={"5px"} />
        <Text fontSize={"3xl"} fontWeight={"100"}>
          {timeCommitment}
        </Text>
        <Text fontWeight={"700"}> Hours per Week</Text>
      </Stack>
      <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
        <Icon as={MdExtension} w={8} h={8} pos={"relative"} top={"3px"} />
        <Text fontSize={"3xl"} fontWeight={"100"}>
          {difficulty}
        </Text>

        <Text fontWeight={"700"}>/ 5.0 Difficulty</Text>
      </Stack>
      <Divider w={["auto", null, null, 48]} />
      <Stack>
        <Stack direction={"row"} justifyContent={["center", null, null, "flex-start"]} align={"baseline"}>
          <Icon as={MdMode} w={8} h={8} pos={"relative"} top={"3px"} />
          <Heading size={"md"} textAlign={"left"}>
            Common Pairings
          </Heading>
        </Stack>
        <Stack alignItems={"center"}>{coursePairsCollapse}</Stack>
        <Divider w={["auto", null, null, 48]} />
      </Stack>
    </Stack>
  );
};

export default CourseStats;
