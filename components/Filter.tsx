import React, { FC } from "react";
import { Button, Box, Wrap } from "@chakra-ui/react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    SettingsIcon,
    StarIcon,
} from "@chakra-ui/icons";

interface FilterProps {}

const Filter: FC<FilterProps> = ({}) => {
    return (
        <Box w="90%" my={4}>
            <Wrap spacing={4} justify="center">
                <Button colorScheme="orange" size="lg" variant="ghost">
                    All Classes
                </Button>
                <Button
                    colorScheme="orange"
                    size="lg"
                    variant="ghost"
                    leftIcon={<ArrowDownIcon />}
                >
                    Lower Division
                </Button>
                <Button
                    colorScheme="orange"
                    size="lg"
                    variant="ghost"
                    leftIcon={<ArrowUpIcon />}
                >
                    Upper Division
                </Button>
                <Button
                    colorScheme="orange"
                    size="lg"
                    variant="ghost"
                    leftIcon={<SettingsIcon />}
                >
                    Core Classes
                </Button>
                <Button
                    colorScheme="orange"
                    size="lg"
                    variant="ghost"
                    leftIcon={<StarIcon />}
                >
                    Electives
                </Button>
            </Wrap>
        </Box>
    );
};

export default Filter;
