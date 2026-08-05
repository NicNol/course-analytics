import React, { FC, useState } from "react";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";
import { Button, Box, Center, Flex, Link, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
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
        bg={useColorModeValue("orange.100", "gray.700")}
        boxShadow={"lg"}
        rounded={"md"}
        overflow={"hidden"}
        _hover={{}}
      >
        <Flex justify={"center"} pt={6} color={useColorModeValue("gray.800", "white")} gap={2}>
          {tagComponents}
        </Flex>
        <Link asChild _hover={{}}>
          <NextLink
            onClick={() => setLoadingStatus(true)}
            data-href={`/courses/${code.replace(" ", "-")}`}
            href={`/courses/${code.replace(" ", "-")}`}
          >
            <Text
              textAlign={"center"}
              fontSize={"5xl"}
              fontWeight={800}
              textShadow={useColorModeValue("2px 2px #eee", "2px 2px #333")}
              data-cy={"CourseNumber"}
            >
              {code}
            </Text>
          </NextLink>
        </Link>
        <Flex
          align={"center"}
          justify={"center"}
          bg={useColorModeValue(
            "rgb(68,68,68) linear-gradient(0deg, rgba(68,68,68,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(68,68,68,1) 100%)",
            "rgb(160,174,192) linear-gradient(0deg, rgba(160,174,192,1) 0%, rgba(203,213,224,1) 10%, rgba(203,213,224,1) 90%, rgba(160,174,192,1) 100%)"
          )}
          h={16}
          px={8}
        >
          <Link asChild _hover={{}}>
            <NextLink
              onClick={() => setLoadingStatus(true)}
              data-href={`/courses/${code.replace(" ", "-")}`}
              href={`/courses/${code.replace(" ", "-")}`}
            >
              <Text
                textAlign={"center"}
                color={useColorModeValue("white", "black")}
                fontWeight={"600"}
                data-cy={"CourseTitle"}
              >
                {title}
              </Text>
            </NextLink>
          </Link>
        </Flex>
        <Flex
          bg={useColorModeValue("#f5f5f5", "gray.900")}
          px={6}
          py={4}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <Flex color={useColorModeValue("#333", "#ccc")} alignItems={"center"}>
            <Flex direction={"column"}>
              <Stat icon={MdFeedback} iconPosition={"8px"} stat={reviews} label={"Reviews"} />
              <Stat icon={MdAccessTime} iconPosition={"5px"} stat={time} label={"Hours per Week"} />
              <Stat
                icon={MdExtension}
                iconPosition={"3px"}
                stat={parseFloat(difficulty).toFixed(1)}
                label={"/ 5.0 Difficulty"}
              />
            </Flex>
          </Flex>
          <Link asChild _hover={{}}>
            <NextLink
              onClick={() => setLoadingStatus(true)}
              data-href={`/courses/${code.replace(" ", "-")}`}
              href={`/courses/${code.replace(" ", "-")}`}
            >
              <Button
                data-href={`/courses/${code.replace(" ", "-")}`}
                mt={2}
                variant={"link"}
                color={useColorModeValue("#CC3F04", "blue.200")}
                rounded={"xl"}
                p={2}
                _hover={{
                  bg: useColorModeValue("orange.100", "gray.600"),
                  color: useColorModeValue("#C83602", "white"),
                }}
                _focus={{
                  bg: useColorModeValue("orange.100", "gray.600"),
                  color: useColorModeValue("#C83602", "white"),
                }}
                _active={{
                  bg: useColorModeValue("orange.200", "gray.400"),
                }}
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
