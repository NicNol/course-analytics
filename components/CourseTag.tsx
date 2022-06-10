import React, { FC } from "react";
import { Text, useColorModeValue } from "@chakra-ui/react";

interface CourseTagProps {
    children: string;
}

const CourseTag: FC<CourseTagProps> = ({ children }) => {
    return (
        <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("orange.50", "gray.600")}
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
