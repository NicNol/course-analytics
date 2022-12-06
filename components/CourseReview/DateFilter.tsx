import React, { FC } from "react";
import { Button, Box, Wrap, useBoolean, useColorModeValue } from "@chakra-ui/react";
import { MdCalendarToday } from "react-icons/md";

interface FilterProps {
  handleFilter: Function;
}

interface Toggle {
  readonly on: () => void;
  readonly off: () => void;
  readonly toggle: () => void;
}

interface ButtonToggles {
  All: Toggle;
  TwoYears: Toggle;
  SixMonths: Toggle;
}

const Filter: FC<FilterProps> = ({ handleFilter }) => {
  const [allStatus, setAllStatus] = useBoolean(true);
  const [twoYearsStatus, setTwoYearsStatus] = useBoolean();
  const [sixMonthsStatus, setSixMonthsStatus] = useBoolean();

  function handleButtonStatus(buttonName: string): void {
    const buttons: ButtonToggles = {
      All: setAllStatus,
      TwoYears: setTwoYearsStatus,
      SixMonths: setSixMonthsStatus,
    };

    for (const button in buttons) {
      if (buttons.hasOwnProperty(buttonName) && button == buttonName) {
        (buttons as any)[buttonName].on();
        continue;
      }
      (buttons as any)[button].off();
    }
  }

  return (
    <Box w="90%" mt={4} ml="5%">
      <Wrap spacing={2} justify="center">
        <Button
          colorScheme={useColorModeValue("orange", "black")}
          size="lg"
          variant="ghost"
          leftIcon={<MdCalendarToday />}
          isActive={allStatus}
          onClick={() => {
            handleFilter(99999);
            handleButtonStatus("All");
          }}
        >
          All Time
        </Button>
        <Button
          colorScheme={useColorModeValue("orange", "black")}
          size="lg"
          variant="ghost"
          leftIcon={<MdCalendarToday />}
          isActive={twoYearsStatus}
          onClick={() => {
            handleFilter(730);
            handleButtonStatus("TwoYears");
          }}
        >
          Past 2 Years
        </Button>
        <Button
          colorScheme={useColorModeValue("orange", "black")}
          size="lg"
          variant="ghost"
          leftIcon={<MdCalendarToday />}
          isActive={sixMonthsStatus}
          onClick={() => {
            handleFilter(183);
            handleButtonStatus("SixMonths");
          }}
        >
          Past 6 Months
        </Button>
      </Wrap>
    </Box>
  );
};

export default Filter;
