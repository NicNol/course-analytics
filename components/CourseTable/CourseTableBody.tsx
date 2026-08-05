import React, { FC } from "react";
import { Box, Flex, Icon, Link, Table } from "@chakra-ui/react";
import NextLink from "next/link";
import { ISummary } from "../../scraper/src/models/summary";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";

interface CourseTableBodyProps {
  jsonData: ISummary[];
}

const CourseTableBody: FC<CourseTableBodyProps> = ({ jsonData }) => {
  return (
    <Table.Body bg={{ base: "#fcfcfc", _dark: "gray.900" }} color={{ base: "#333", _dark: "#ccc" }}>
      {jsonData.map((row, r_index) => {
        const {
          code,
          title,
          ["average difficulty"]: averageDifficulty,
          ["time commitment"]: timeCommitment,
          ["review count"]: reviewCount,
        } = row;

        return (
          <Table.Row key={r_index} data-cy={"CourseTableRow"}>
            <Table.Cell key={`${r_index}-0`} textAlign={"left"}>
              <Link asChild fontWeight={"600"}>
                <NextLink href={`/courses/${code.replace(" ", "-")}`}>{`${code} - ${title}`}</NextLink>
              </Link>
            </Table.Cell>
            <Table.Cell key={`${r_index}-1`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdExtension} w={6} h={6} />
                </Box>
                <Box w={16}>{parseFloat(averageDifficulty).toFixed(1)} / 5.0</Box>
              </Flex>
            </Table.Cell>
            <Table.Cell key={`${r_index}-2`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdAccessTime} w={6} h={6} />
                </Box>
                <Box w={16}>{timeCommitment} Hours</Box>
              </Flex>
            </Table.Cell>
            <Table.Cell key={`${r_index}-$3`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdFeedback} w={6} h={6} />
                </Box>
                <Box w={24}>{reviewCount} Reviews </Box>
              </Flex>
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  );
};

export default CourseTableBody;
