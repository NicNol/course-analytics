import React, { FC } from "react";
import { chakra, Table } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "../icons";
import { IColumnState } from "./CourseTable";

interface CourseTableHeaderCellProps {
  column: IColumnState;
  handleHeaderClick: (header: string) => void;
}

const CourseTableHeaderCell: FC<CourseTableHeaderCellProps> = ({ column, handleHeaderClick }) => {
  function handleArrowRender(columnFilter: string | null): React.JSX.Element {
    const asc = <TriangleUpIcon w={4} h={4} />;
    const desc = <TriangleDownIcon w={4} h={4} />;
    const inv = <TriangleUpIcon w={4} h={4} visibility={"hidden"} />;

    if (columnFilter) {
      const icon = columnFilter === "asc" ? asc : desc;
      return icon;
    }
    return inv;
  }

  const ariaSort = column.filter === "asc" ? "ascending" : column.filter === "desc" ? "descending" : "none";

  return (
    <Table.ColumnHeader
      aria-sort={ariaSort}
      onClick={() => handleHeaderClick(column.header)}
      _hover={{
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      <chakra.button
        type={"button"}
        display={"flex"}
        gap={4}
        color={"fg"}
        font={"inherit"}
        textAlign={"start"}
        cursor={"pointer"}
        rounded={"l3"}
        _focusVisible={{ outline: "2px solid", outlineColor: "colorPalette.solid", outlineOffset: "2px" }}
      >
        {column.header}
        {handleArrowRender(column.filter)}
      </chakra.button>
    </Table.ColumnHeader>
  );
};

export default CourseTableHeaderCell;
