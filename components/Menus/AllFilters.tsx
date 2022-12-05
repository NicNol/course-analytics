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
    <Flex justifyContent={"center"} gap={2} my={2}>
      <ClassMenu handleFilter={classFilter} />
      <ViewLayoutMenu setLayoutView={setLayoutView} />
      <DateMenu handleFilter={dateFilter} />
    </Flex>
  );
};

export default AllFilters;
