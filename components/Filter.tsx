import React, { FC } from "react";
import { Box, Wrap, useColorModeValue, ButtonGroup } from "@chakra-ui/react";
import ClassMenu from "./Menus/ClassMenu";
import ViewLayoutMenu from "./Menus/ViewLayoutMenu";

interface FilterProps {
    handleFilter: (filter: string) => void;
    setLayoutView: (filter: string) => void;
}

const Filter: FC<FilterProps> = ({ handleFilter, setLayoutView }) => {
    return (
        <>
            <ButtonGroup
                colorScheme={useColorModeValue("orange", "black")}
                size="lg"
                variant="ghost"
            >
                <Box w="90%" my={4} ml="5%">
                    <Wrap spacing={2} justify="center">
                        <ClassMenu handleFilter={handleFilter} />
                        <ViewLayoutMenu setLayoutView={setLayoutView} />
                    </Wrap>
                </Box>
            </ButtonGroup>
        </>
    );
};

export default Filter;
