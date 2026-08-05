import React, { FC } from "react";
import { Text } from "@chakra-ui/react";

interface CourseTagProps {
    children: string;
}

const CourseTag: FC<CourseTagProps> = ({ children }) => {
    return (
        <Text
            fontSize={"sm"}
            fontWeight={"medium"}
            bg={"colorPalette.subtle"}
            color={"colorPalette.fg"}
            p={2}
            px={3}
            rounded={"full"}
            data-cy={"CourseTag"}
        >
            {children}
        </Text>
    );
};

export default CourseTag;
