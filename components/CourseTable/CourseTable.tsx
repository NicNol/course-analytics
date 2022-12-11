import React, { FC, useEffect, useState } from "react";
import { ISummary } from "../../util/models/summary";
import { Box, Center, Table, useColorModeValue } from "@chakra-ui/react";
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

function sortCoursesByColumnAccessor(courseData: ISummary[], columnAccessor: ColumnAccessor, direction: number) {
  const arr = courseData.sort((a: ISummary, b: ISummary) => {
    const x = isNaN(a[columnAccessor] as any) ? a[columnAccessor] : parseFloat(a[columnAccessor]);
    const y = isNaN(b[columnAccessor] as any) ? b[columnAccessor] : parseFloat(b[columnAccessor]);
    return x < y ? -1 : x > y ? 1 : 0;
  });
  return direction >= 0 ? arr : arr.reverse();
}

const CourseTable: FC<CourseTableProps> = ({ filter, jsonData }) => {
  const data: ISummary[] = jsonData
    .filter((summary) => summary.tags.some((tag) => filter.includes(tag)))
    .filter((value) => value !== null && value !== undefined);
  const [columnState, setColumnState] = useState(columns);
  const [sortedData, setSortedData] = useState<ISummary[]>(data);

  useEffect(() => {
    const [accessor, direction] = findAccessor(columnState);
    const sortedData = sortCoursesByColumnAccessor(data, accessor, direction);
    setSortedData(sortedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnState, filter, jsonData]);

  function findAccessor(columns: IColumnState[]): [ColumnAccessor, number] {
    const column = columns.find((column) => column.filter);
    if (!column) return [ColumnAccessor.code, 0];

    const { accessor, filter } = column;
    const direction = filter === "asc" ? 1 : -1;
    return [accessor, direction];
  }

  return (
    <Center>
      <Box
        borderRadius={"md"}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.100", "gray.700")}
        overflowX={"auto"}
        mx={4}
      >
        <Table maxW={"container.xl"}>
          <CourseTableHeader columns={columnState} setColumnState={setColumnState} />
          <CourseTableBody jsonData={sortedData} />
        </Table>
      </Box>
    </Center>
  );
};

export default CourseTable;
