import React, { FC } from "react";
import { Button, Box, Wrap, useColorModeValue } from "@chakra-ui/react";
import { MdCalendarToday } from "react-icons/md";

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
                    onClick={() => handleFilter(99999)}
                >
                    All Time
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<MdCalendarToday />}
                    onClick={() => handleFilter(730)}
                >
                    Past 2 Years
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<MdCalendarToday />}
                    onClick={() => handleFilter(183)}
                >
                    Past 6 Months
                </Button>
            </Wrap>
        </Box>
    );
};

export default Filter;
