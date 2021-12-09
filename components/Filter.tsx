import React, { FC } from "react";
import { Button, Box, Wrap, useColorModeValue } from "@chakra-ui/react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    SettingsIcon,
    StarIcon,
} from "@chakra-ui/icons";

interface FilterProps {
    handleFilter: Function;
}

const Filter: FC<FilterProps> = ({ handleFilter }) => {
    return (
        <Box w="90%" mt={4} ml="5%">
            <Wrap spacing={2} justify="center">
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    onClick={() =>
                        handleFilter([
                            "Lower Division",
                            "Core Class",
                            "Upper Division",
                            "Elective",
                        ])
                    }
                >
                    All Classes
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<ArrowDownIcon />}
                    onClick={() => handleFilter(["Lower Division"])}
                >
                    Lower Division
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<ArrowUpIcon />}
                    onClick={() => handleFilter(["Upper Division"])}
                >
                    Upper Division
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<SettingsIcon />}
                    onClick={() => handleFilter(["Core Class"])}
                >
                    Core Classes
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<StarIcon />}
                    onClick={() => handleFilter(["Elective"])}
                >
                    Electives
                </Button>
            </Wrap>
        </Box>
    );
};

export default Filter;
