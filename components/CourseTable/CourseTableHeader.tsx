import React, { FC } from "react";
import { Table } from "@chakra-ui/react";
import { IColumnState } from "./CourseTable";
import CourseTableHeaderCell from "./CourseTableHeaderCell";

interface CourseTableHeaderProps {
  columns: IColumnState[];
  setColumnState: (columnState: IColumnState[]) => void;
}

const CourseTableHeader: FC<CourseTableHeaderProps> = ({ columns, setColumnState }) => {
  function handleHeaderClick(columnHeader: string): void {
    const newColumnState = columns.map((column): IColumnState => {
      if (column.header !== columnHeader) return { ...column, filter: null };
      return { ...column, filter: column.filter === "asc" ? "desc" : "asc" };
    });

    setColumnState(newColumnState);
  }

  return (
    <Table.Header>
      <Table.Row bg={"colorPalette.muted"}>
        {columns.map((column) => (
          <CourseTableHeaderCell key={column.accessor} column={column} handleHeaderClick={handleHeaderClick} />
        ))}
      </Table.Row>
    </Table.Header>
  );
};

export default CourseTableHeader;
