import React, { FC } from "react";
import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

interface PaginationProps {
  pageNumber: number;
  totalTipCount: number;
  tipsPerPage: number;
  changePage: (delta: number) => void;
}

const Pagination: FC<PaginationProps> = ({ pageNumber, totalTipCount, tipsPerPage, changePage }) => {
  const buttonHoverColor = useColorModeValue("orange.400", "blue.200");
  const pageCount = Math.ceil(totalTipCount / tipsPerPage);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Button
        isDisabled={pageNumber === 1}
        onClick={() => changePage(-1)}
        leftIcon={<ArrowBackIcon />}
        variant={"link"}
        _hover={{ color: pageNumber === 1 ? "inherit" : buttonHoverColor }}
      >
        <Text pb={1}>Previous</Text>
      </Button>
      <Text textAlign={"center"}>{`Page ${pageNumber} of ${pageCount}`}</Text>
      <Button
        isDisabled={pageNumber === pageCount}
        onClick={() => changePage(1)}
        rightIcon={<ArrowForwardIcon />}
        variant={"link"}
        _hover={{
          color: pageNumber === pageCount ? "inherit" : buttonHoverColor,
        }}
      >
        <Text pb={1}>Next</Text>
      </Button>
    </Flex>
  );
};

export default Pagination;
