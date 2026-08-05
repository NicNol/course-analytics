import React, { FC } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "../icons";

interface PaginationProps {
  pageNumber: number;
  totalTipCount: number;
  tipsPerPage: number;
  changePage: (delta: number) => void;
}

const Pagination: FC<PaginationProps> = ({ pageNumber, totalTipCount, tipsPerPage, changePage }) => {
  const pageCount = Math.ceil(totalTipCount / tipsPerPage);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Button
        disabled={pageNumber === 1}
        onClick={() => changePage(-1)}
        variant={"plain"}
        _hover={{ color: pageNumber === 1 ? "inherit" : "colorPalette.fg" }}
      >
        <ArrowBackIcon />
        <Text pb={1}>Previous</Text>
      </Button>
      <Text textAlign={"center"}>{`Page ${pageNumber} of ${pageCount}`}</Text>
      <Button
        disabled={pageNumber === pageCount}
        onClick={() => changePage(1)}
        variant={"plain"}
        _hover={{
          color: pageNumber === pageCount ? "inherit" : "colorPalette.fg",
        }}
      >
        <Text pb={1}>Next</Text>
        <ArrowForwardIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
