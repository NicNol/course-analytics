import React, { FC } from "react";
import { Table } from "@chakra-ui/react";
import { IColumnState } from "./CourseTable";
import CourseTableHeaderCell from "./CourseTableHeaderCell";

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

    return (
        <Table.Header>
            <Table.Row bg={"colorPalette.muted"}>
                {columns.map((column) => (
                    <CourseTableHeaderCell
                        key={column.accessor}
                        column={column}
                        handleHeaderClick={handleHeaderClick}
                    />
                ))}
            </Table.Row>
        </Table.Header>
    );
};

export default CourseTableHeader;
