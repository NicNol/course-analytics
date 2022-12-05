import React, { FC, useState } from "react";
import { Button, Menu, MenuButton, MenuList, useColorModeValue } from "@chakra-ui/react";
import { ChevronDownIcon, ViewIcon } from "@chakra-ui/icons";
import { MdCalendarToday } from "react-icons/md";
import MenuItemOption, { IMenuOption } from "./MenuItemOption";
import { DateFilter } from "../../pages/index";

interface DateMenuProps {
  handleFilter: (criteria: DateFilter) => void;
}

const MenuOptions: IMenuOption[] = [
  { title: "All Time", icon: <ViewIcon /> },
  { title: "Past 2 Years", icon: <MdCalendarToday /> },
  { title: "Past 6 Months", icon: <MdCalendarToday /> },
];

const DateMenu: FC<DateMenuProps> = ({ handleFilter }) => {
  const [currentMenuItem, setCurrentMenuItem] = useState(MenuOptions[0].title);

  function handleMenuItemClick(menuItem: DateFilter) {
    handleFilter(menuItem);
    setCurrentMenuItem(menuItem);
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        data-cy={"MenuButton"}
        colorScheme={useColorModeValue("orange", "black")}
        size={"lg"}
        variant={"ghost"}
      >
        {currentMenuItem}
      </MenuButton>
      <MenuList>
        {MenuOptions.map((option) => {
          const { title, icon } = option;
          return (
            <MenuItemOption
              key={title}
              title={title}
              icon={icon}
              clickHandler={() => handleMenuItemClick(title as DateFilter)}
              currentMenuItem={currentMenuItem}
            />
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default DateMenu;
