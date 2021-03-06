import React, { FC, useEffect, useState } from "react";
import { ISummary } from "../../util/models/summary";
import { Box, Center, Table, useColorModeValue } from "@chakra-ui/react";
import CourseTableHeader from "./CourseTableHeader";
import CourseTableBody from "./CourseTableBody";

interface CourseTableProps {
    filter: string[];
    jsonData: CourseListJSON;
}

export interface CourseListJSON {
    data: ISummary[];
}

export interface IColumnState {
    header: string;
    accessor: string;
    filter: "asc" | "desc" | null;
}

const columns: IColumnState[] = [
    {
        header: "Course Name",
        accessor: "name",
        filter: "asc",
    },
    {
        header: "Difficulty",
        accessor: "average difficulty",
        filter: null,
    },
    {
        header: "Time Commitment",
        accessor: "time commitment",
        filter: null,
    },
    {
        header: "Review Count",
        accessor: "review count",
        filter: null,
    },
];

const CourseTable: FC<CourseTableProps> = ({ filter, jsonData }) => {
    const data: ISummary[] = jsonData.data
        .filter((summary) => {
            let inFilter = false;
            for (const tag of summary.tags) {
                if (filter.includes(tag)) {
                    inFilter = true;
                }
            }

            return inFilter;
        })
        .filter((value) => value !== null && value !== undefined);
    const [columnState, setColumnState] = useState(columns);
    const [sortedData, setSortedData] = useState<ISummary[]>(data);

    useEffect(() => {
        const [accessor, direction] = findAccessor(columnState);
        sortOnAccessor(accessor, direction);
    }, [columnState, filter]);

    function findAccessor(columns: IColumnState[]): [string, number] {
        for (const column of columns) {
            if (column.filter) {
                const { accessor } = column;
                const direction = column.filter === "asc" ? 1 : -1;
                return [accessor, direction];
            }
        }
        return ["", 0];
    }

    function sortOnAccessor(columnAccessor: string, direction: number): void {
        const isNumeric = !isNaN(((data as any)[0] as any)[columnAccessor]);
        function sortOnAccessorAlpha(
            summaryA: ISummary,
            summaryB: ISummary
        ): number {
            if (
                (summaryA as any)[columnAccessor] <
                (summaryB as any)[columnAccessor]
            ) {
                return -1;
            }
            if (
                (summaryA as any)[columnAccessor] >
                (summaryB as any)[columnAccessor]
            ) {
                return 1;
            }
            return 0;
        }

        function sortOnAccessorNumeric(
            summaryA: ISummary,
            summaryB: ISummary
        ): number {
            if (
                parseFloat((summaryA as any)[columnAccessor]) <
                parseFloat((summaryB as any)[columnAccessor])
            ) {
                return -1;
            }
            if (
                parseFloat((summaryA as any)[columnAccessor]) >
                parseFloat((summaryB as any)[columnAccessor])
            ) {
                return 1;
            }
            return 0;
        }
        const sortMethod = isNumeric
            ? sortOnAccessorNumeric
            : sortOnAccessorAlpha;
        const sortedData = [...data].sort(sortMethod);
        if (direction < 0) {
            sortedData.reverse();
        }
        setSortedData(sortedData);
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
                    <CourseTableHeader
                        columns={columnState}
                        setColumnState={setColumnState}
                    />
                    <CourseTableBody jsonData={sortedData} />
                </Table>
            </Box>
        </Center>
    );
};

export default CourseTable;
