import React, { FC } from "react";
import { Flex, Text } from "@chakra-ui/react";
import ClassMenu from "./ClassMenu";
import ViewLayoutMenu from "./ViewLayoutMenu";
import DateMenu from "./DateMenu";
import { DateFilter } from "../../pages/index";

interface FilterProps {
  classFilter: (filter: string) => void;
  setLayoutView: (filter: string) => void;
  dateFilter: (criteria: DateFilter) => void;
}

const AllFilters: FC<FilterProps> = ({ classFilter, setLayoutView, dateFilter }) => {
  return (
    <Flex justifyContent={"center"}>
      <Flex gap={1} flexWrap={"wrap"} w={"100%"} maxW={"container.xl"} alignItems={"center"} p={2}>
        <Text fontWeight={600}>Filter Data:</Text>
        <Flex>
          <ClassMenu handleFilter={classFilter} />
          <ViewLayoutMenu setLayoutView={setLayoutView} />
          <DateMenu handleFilter={dateFilter} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AllFilters;
