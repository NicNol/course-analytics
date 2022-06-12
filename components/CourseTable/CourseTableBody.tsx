import React, { FC } from "react";
import { Tbody, Tr, Td } from "@chakra-ui/react";
import { ISummary } from "../../util/models/summary";
import { IColumnState } from "./CourseTable";

interface CourseTableBodyProps {
    jsonData: ISummary[];
    columns: IColumnState[];
}

const CourseTableBody: FC<CourseTableBodyProps> = ({ jsonData, columns }) => {
    return (
        <Tbody>
            {jsonData.map((row, r_index) => {
                return (
                    <Tr key={r_index}>
                        {Object.keys(row).map((cell, c_index) => {
                            return (
                                <Td key={`${r_index}-${c_index}`}>
                                    {(row as any)[cell]}
                                </Td>
                            );
                        })}
                    </Tr>
                );
            })}
        </Tbody>
    );
};

export default CourseTableBody;
