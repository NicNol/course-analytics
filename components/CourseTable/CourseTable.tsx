import React, { FC, useEffect, useState } from "react";
import { ISummary } from "../../util/models/summary";
import { Center, Table } from "@chakra-ui/react";
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
        header: "Time Commitment (Hours)",
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
    const data = jsonData.data.map((summary) => {
        const newSummary = { ...summary };
        delete newSummary.tags;
        return newSummary;
    });
    const [columnState, setColumnState] = useState(columns);
    const [sortedData, setSortedData] = useState(data);

    useEffect(() => {
        const [accessor, direction] = findAccessor(columnState);
        sortOnAccessor(accessor, direction);
    }, [columnState]);

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
            <Table maxW="container.xl" colorScheme={"orange"}>
                <CourseTableHeader
                    columns={columnState}
                    setColumnState={setColumnState}
                />
                <CourseTableBody jsonData={sortedData} columns={columns} />
            </Table>
        </Center>
    );
};

export default CourseTable;
