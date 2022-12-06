import React, { FC } from "react";
import { Flex } from "@chakra-ui/react";
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
      <Flex justifyContent={"center"} gap={2} my={2} flexWrap={"wrap"} maxW={"container.xl"}>
        <Flex flexGrow={"1"} justifyContent={"center"}>
          <ClassMenu handleFilter={classFilter} />
        </Flex>
        <Flex flexGrow={"1"} justifyContent={"center"}>
          <ViewLayoutMenu setLayoutView={setLayoutView} />
        </Flex>
        <Flex flexGrow={"1"} justifyContent={"center"}>
          <DateMenu handleFilter={dateFilter} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AllFilters;
