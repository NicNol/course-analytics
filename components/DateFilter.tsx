import React, { FC } from "react";
import { Button, Box, Wrap, useColorModeValue } from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";

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
                    All Time
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<TimeIcon />}
                    onClick={() => handleFilter(["Lower Division"])}
                >
                    Past 2 Years
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<TimeIcon />}
                    onClick={() => handleFilter(["Upper Division"])}
                >
                    Past 6 Months
                </Button>
            </Wrap>
        </Box>
    );
};

export default Filter;
