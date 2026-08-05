import React, { FC, useState } from "react";
import { ISummary } from "../../scraper/src/models/summary";
import { Box, Center, Table } from "@chakra-ui/react";
import CourseTableHeader from "./CourseTableHeader";
import CourseTableBody from "./CourseTableBody";

interface CourseTableProps {
  filter: string[];
  jsonData: ISummary[];
}

enum ColumnAccessor {
  code = "code",
  averageDifficulty = "average difficulty",
  timeCommitment = "time commitment",
  reviewCount = "review count",
}

export interface IColumnState {
  header: string;
  accessor: ColumnAccessor;
  filter: "asc" | "desc" | null;
}

const columns: IColumnState[] = [
  {
    header: "Course Name",
    accessor: ColumnAccessor.code,
    filter: "asc",
  },
  {
    header: "Difficulty",
    accessor: ColumnAccessor.averageDifficulty,
    filter: null,
  },
  {
    header: "Time Commitment",
    accessor: ColumnAccessor.timeCommitment,
    filter: null,
  },
  {
    header: "Review Count",
    accessor: ColumnAccessor.reviewCount,
    filter: null,
  },
];

function findAccessor(columns: IColumnState[]): [ColumnAccessor, number] {
  const column = columns.find((column) => column.filter);
  if (!column) return [ColumnAccessor.code, 0];

  const { accessor, filter } = column;
  const direction = filter === "asc" ? 1 : -1;
  return [accessor, direction];
}

function sortCoursesByColumnAccessor(courseData: ISummary[], columnAccessor: ColumnAccessor, direction: number) {
  const arr = courseData.sort((a: ISummary, b: ISummary) => {
    const aValue = a[columnAccessor];
    const bValue = b[columnAccessor];
    const x = Number.isNaN(Number(aValue)) ? aValue : parseFloat(aValue);
    const y = Number.isNaN(Number(bValue)) ? bValue : parseFloat(bValue);
    return x < y ? -1 : x > y ? 1 : 0;
  });
  return direction >= 0 ? arr : arr.reverse();
}

const CourseTable: FC<CourseTableProps> = ({ filter, jsonData }) => {
  const [columnState, setColumnState] = useState(columns);

  const data: ISummary[] = jsonData
    .filter((summary) => summary.tags.some((tag) => filter.includes(tag)))
    .filter((value) => value !== null && value !== undefined);

  const [accessor, direction] = findAccessor(columnState);
  const sortedData = sortCoursesByColumnAccessor(data, accessor, direction);

  return (
    <Center>
      <Box
        borderRadius={"md"}
        border={"1px solid"}
        borderColor={{ base: "gray.100", _dark: "gray.700" }}
        overflowX={"auto"}
        mx={4}
      >
        <Table.Root maxW={"container.xl"}>
          <CourseTableHeader columns={columnState} setColumnState={setColumnState} />
          <CourseTableBody jsonData={sortedData} />
        </Table.Root>
      </Box>
    </Center>
  );
};

export default CourseTable;
