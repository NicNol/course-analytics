import React, { FC } from "react";
import { Flex } from "@chakra-ui/react";
import ClassMenu from "./Menus/ClassMenu";
import ViewLayoutMenu from "./Menus/ViewLayoutMenu";
import DateMenu from "./Menus/DateMenu";
import { DateFilter } from "../pages/index";

interface FilterProps {
  classFilter: (filter: string) => void;
  setLayoutView: (filter: string) => void;
  dateFilter: (criteria: DateFilter) => void;
}

const Filter: FC<FilterProps> = ({ classFilter, setLayoutView, dateFilter }) => {
  return (
    <Flex justifyContent="center" gap={2} my={2}>
      <ClassMenu handleFilter={classFilter} />
      <ViewLayoutMenu setLayoutView={setLayoutView} />
      <DateMenu handleFilter={dateFilter} />
    </Flex>
  );
};

export default Filter;
