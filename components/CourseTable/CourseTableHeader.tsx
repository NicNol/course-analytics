import React, { FC } from "react";
import { Flex, Thead, Tr, Th } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { IColumnState } from "./CourseTable";

interface CourseTableHeaderProps {
    columns: IColumnState[];
    setColumnState: (columnState: IColumnState[]) => void;
}

const CourseTableHeader: FC<CourseTableHeaderProps> = ({
    columns,
    setColumnState,
}) => {
    function handleHeaderClick(columnHeader: string): void {
        const newColumnState: IColumnState[] = [...columns];

        for (let i = 0; i < newColumnState.length; i++) {
            if (newColumnState[i].header === columnHeader) {
                switch (newColumnState[i].filter) {
                    case null:
                        newColumnState[i].filter = "asc";
                        break;
                    case "asc":
                        newColumnState[i].filter = "desc";
                        break;
                    case "desc":
                        newColumnState[i].filter = "asc";
                        break;
                }

                if (newColumnState[i].filter === null) {
                    newColumnState[i].filter = "asc";
                }
            } else {
                newColumnState[i].filter = null;
            }
        }

        setColumnState(newColumnState);
    }

    function handleArrowRender(columnFilter: string | null): JSX.Element {
        const asc = <TriangleUpIcon w={4} h={4} />;
        const desc = <TriangleDownIcon w={4} h={4} />;
        const inv = <TriangleUpIcon w={4} h={4} visibility={"hidden"} />;

        if (columnFilter) {
            const icon = columnFilter === "asc" ? asc : desc;
            return icon;
        }
        return inv;
    }

    return (
        <Thead>
            <Tr>
                {columns.map((column) => (
                    <Th
                        key={column.accessor}
                        onClick={() => handleHeaderClick(column.header)}
                        _hover={{
                            cursor: "pointer",
                            textDecoration: "underline",
                        }}
                    >
                        <Flex gap={4}>
                            {column.header}
                            {handleArrowRender(column.filter)}
                        </Flex>
                    </Th>
                ))}
            </Tr>
        </Thead>
    );
};

export default CourseTableHeader;
