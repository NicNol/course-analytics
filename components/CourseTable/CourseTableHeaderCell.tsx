import React, { FC } from "react";
import { Flex, Th, useColorModeValue } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { IColumnState } from "./CourseTable";

interface CourseTableHeaderCellProps {
    column: IColumnState;
    handleHeaderClick: (header: string) => void;
}

const CourseTableHeaderCell: FC<CourseTableHeaderCellProps> = ({
    column,
    handleHeaderClick,
}) => {
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
        <Th
            onClick={() => handleHeaderClick(column.header)}
            _hover={{
                cursor: "pointer",
                textDecoration: "underline",
            }}
        >
            <Flex gap={4} color={useColorModeValue("gray.800", "white")}>
                {column.header}
                {handleArrowRender(column.filter)}
            </Flex>
        </Th>
    );
};

export default CourseTableHeaderCell;
