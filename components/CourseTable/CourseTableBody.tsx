import React, { FC } from "react";
import { Box, Flex, Icon, Link, Tbody, Tr, Td, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { ISummary } from "../../util/models/summary";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";

interface CourseTableBodyProps {
  jsonData: ISummary[];
}

const CourseTableBody: FC<CourseTableBodyProps> = ({ jsonData }) => {
  return (
    <Tbody bg={useColorModeValue("#fcfcfc", "gray.900")} color={useColorModeValue("#333", "#ccc")}>
      {jsonData.map((row, r_index) => {
        const {
          code,
          title,
          ["average difficulty"]: averageDifficulty,
          ["time commitment"]: timeCommitment,
          ["review count"]: reviewCount,
        } = row;

        return (
          <Tr key={r_index} data-cy={"CourseTableRow"}>
            <Td key={`${r_index}-0`} textAlign={"left"}>
              <Link
                as={NextLink}
                href={`/courses/${code.replace(" ", "-")}`}
                fontWeight={"600"}
              >{`${code} - ${title}`}</Link>
            </Td>
            <Td key={`${r_index}-1`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdExtension} w={6} h={6} />
                </Box>
                <Box w={16}>{parseFloat(averageDifficulty).toFixed(1)} / 5.0</Box>
              </Flex>
            </Td>
            <Td key={`${r_index}-2`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdAccessTime} w={6} h={6} />
                </Box>
                <Box w={16}>{timeCommitment} Hours</Box>
              </Flex>
            </Td>
            <Td key={`${r_index}-$3`} textAlign={"center"} position={"relative"} right={"15px"}>
              <Flex gap={2} justifyContent={"center"}>
                <Box w={6}>
                  <Icon as={MdFeedback} w={6} h={6} />
                </Box>
                <Box w={24}>{reviewCount} Reviews </Box>
              </Flex>
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
};

export default CourseTableBody;
