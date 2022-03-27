import React, { FC } from "react";
import { ISummary } from "../util/models/summary";
import { Center, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

interface CourseTableProps {
    filter: string[];
    jsonData: CourseListJSON;
}

interface CourseListJSON {
    data: ISummary[];
}

const CourseTable: FC<CourseTableProps> = ({ filter, jsonData }) => {
    const data = React.useMemo(() => jsonData.data, [jsonData]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Course Name",
                accessor: "name",
                isNumeric: false,
            },
            {
                Header: "Difficulty",
                accessor: "difficulty",
                isNumeric: true,
            },
            {
                Header: "Time Commitment",
                accessor: "time",
                isNumeric: true,
            },
            {
                Header: "Review Count",
                accessor: "reviews",
                isNumeric: true,
            },
            {
                Header: "Tags",
                accessor: "tags",
                isNumeric: false,
            },
        ],
        []
    );

    return (
        <Center>
            <Table maxW="container.xl">
                <Thead>
                    <Tr>
                        {columns.map((column) => (
                            <Th key={column.accessor}>{column.Header}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((row, r_index) => {
                        return (
                            <Tr key={r_index}>
                                {Object.keys(row).map((cell, c_index) => {
                                    console.log(cell);
                                    return (
                                        <Td key={`${r_index}-${c_index}`}>
                                            {row[cell]}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Center>
    );
};

export default CourseTable;
