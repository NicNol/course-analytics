import React, { FC } from "react";
import { Text } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

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
