import React, { FC, useState } from "react";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";
import { Button, Box, Center, Flex, Link, Text } from "@chakra-ui/react";
import CourseTag from "./CourseTag";
import NextLink from "next/link";
import { ArrowForwardIcon } from "../icons";
import Stat from "./Stat";

interface CourseTileProps {
  tags: Array<string>;
  code: string;
  title: string;
  reviews: string;
  difficulty: string;
  time: string;
}

const CourseTile: FC<CourseTileProps> = ({ tags, code, title, reviews, difficulty, time }) => {
  const tagComponents = tags.map((tag) => <CourseTag key={Number + tag}>{tag}</CourseTag>);

  const [loadingStatus, setLoadingStatus] = useState(false);

  return (
    <Center p={2} data-cy={"CourseTile"}>
      <Box
        maxW={"330px"}
        w={"330px"}
        bg={"bg.panel"}
        borderWidth={"1px"}
        borderColor={"border"}
        boxShadow={"lg"}
        rounded={"l3"}
        overflow={"hidden"}
        _hover={{ textDecoration: "none" }}
      >
        <Flex justify={"center"} pt={6} gap={2}>
          {tagComponents}
        </Flex>
        <Link asChild _hover={{ textDecoration: "none" }}>
          <NextLink
            onClick={() => setLoadingStatus(true)}
            data-href={`/courses/${code.replace(" ", "-")}`}
            href={`/courses/${code.replace(" ", "-")}`}
          >
            <Text textAlign={"center"} fontSize={"5xl"} fontWeight={"extrabold"} data-cy={"CourseNumber"}>
              {code}
            </Text>
          </NextLink>
        </Link>
        <Flex align={"center"} justify={"center"} bg={"colorPalette.solid"} h={16} px={8}>
          <Link asChild _hover={{ textDecoration: "none" }}>
            <NextLink
              onClick={() => setLoadingStatus(true)}
              data-href={`/courses/${code.replace(" ", "-")}`}
              href={`/courses/${code.replace(" ", "-")}`}
            >
              <Text
                textAlign={"center"}
                color={"colorPalette.contrast"}
                fontWeight={"semibold"}
                data-cy={"CourseTitle"}
              >
                {title}
              </Text>
            </NextLink>
          </Link>
        </Flex>
        <Flex bg={"bg.muted"} px={6} py={4} flexDirection={"column"} alignItems={"center"}>
          <Flex color={"fg.muted"} alignItems={"center"}>
            <Flex direction={"column"}>
              <Stat icon={MdFeedback} stat={reviews} label={"Reviews"} />
              <Stat icon={MdAccessTime} stat={time} label={"Hours per Week"} />
              <Stat icon={MdExtension} stat={parseFloat(difficulty).toFixed(1)} label={"/ 5.0 Difficulty"} />
            </Flex>
          </Flex>
          <Link asChild _hover={{ textDecoration: "none" }}>
            <NextLink
              onClick={() => setLoadingStatus(true)}
              data-href={`/courses/${code.replace(" ", "-")}`}
              href={`/courses/${code.replace(" ", "-")}`}
            >
              <Button
                data-href={`/courses/${code.replace(" ", "-")}`}
                mt={2}
                variant={"plain"}
                color={"colorPalette.fg"}
                rounded={"l2"}
                p={2}
                _hover={{ bg: "colorPalette.muted" }}
                loading={loadingStatus}
                loadingText="Loading"
              >
                View Details
                <ArrowForwardIcon />
              </Button>
            </NextLink>
          </Link>
        </Flex>
      </Box>
    </Center>
  );
};

export default CourseTile;
