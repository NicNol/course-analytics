import React, { FC } from "react";
import { Button, Box, Wrap, useBoolean, useColorModeValue } from "@chakra-ui/react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    SettingsIcon,
    StarIcon,
} from "@chakra-ui/icons";

interface FilterProps {
    handleFilter: Function;
}

interface Toggle { 
    readonly on: () => void; 
    readonly off: () => void; 
    readonly toggle: () => void; 
}

interface ButtonToggles {
    "All": Toggle,
    "Lower": Toggle,
    "Upper": Toggle,
    "Core": Toggle,
    "Electives": Toggle
}

const Filter: FC<FilterProps> = ({ handleFilter }) => {

    const [allStatus, setAllStatus] = useBoolean(true)
    const [lowerStatus, setLowerStatus] = useBoolean()
    const [upperStatus, setUpperStatus] = useBoolean()
    const [coreStatus, setCoreStatus] = useBoolean()
    const [electivesStatus, setElectivesStatus] = useBoolean()

    function handleButtonStatus (buttonName: string): void {
        const buttons: ButtonToggles = {
            "All": setAllStatus,
            "Lower": setLowerStatus,
            "Upper": setUpperStatus,
            "Core": setCoreStatus,
            "Electives": setElectivesStatus
        }
        
        for (const button in buttons) {
            if (buttons.hasOwnProperty(buttonName) && button == buttonName) {
                (buttons as any)[buttonName].on()
                continue;
            }
            (buttons as any)[button].off()
        }

    }

    return (
        <Box w="90%" mt={4} ml="5%">
            <Wrap spacing={2} justify="center">
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    isActive={allStatus}
                    onClick={() => {
                        handleFilter([
                            "Lower Division",
                            "Core Class",
                            "Upper Division",
                            "Elective",
                        ])
                        handleButtonStatus("All");
                    }
                    }>
                    All Classes
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    isActive={lowerStatus}
                    leftIcon={<ArrowDownIcon />}
                    onClick={() => {
                        handleFilter(["Lower Division"]);
                        handleButtonStatus("Lower");
                    }}
                >
                    Lower Division
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<ArrowUpIcon />}
                    isActive={upperStatus}
                    onClick={() => {
                        handleFilter(["Upper Division"]);
                        handleButtonStatus("Upper");
                    }}
                >
                    Upper Division
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<SettingsIcon />}
                    isActive={coreStatus}
                    onClick={() => {
                        handleFilter(["Core Class"]);
                        handleButtonStatus("Core");
                    }}
                >
                    Core Classes
                </Button>
                <Button
                    colorScheme={useColorModeValue("orange", "black")}
                    size="lg"
                    variant="ghost"
                    leftIcon={<StarIcon />}
                    isActive={electivesStatus}
                    onClick={() => {
                        handleFilter(["Elective"]);
                        handleButtonStatus("Electives");
                    }}
                >
                    Electives
                </Button>
            </Wrap>
        </Box>
    );
};

export default Filter;
