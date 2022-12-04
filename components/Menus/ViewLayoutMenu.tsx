import React, { FC, useState } from "react";
import { Button, Menu, MenuButton, MenuList, useColorModeValue } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CgCardHearts } from "react-icons/cg";
import { BsTable } from "react-icons/bs";
import MenuItemOption, { IMenuOption } from "./MenuItemOption";

interface ViewLayoutMenuProps {
  setLayoutView: (filter: string) => void;
}

const MenuOptions: IMenuOption[] = [
  { title: "Card View", icon: <CgCardHearts /> },
  { title: "Table View", icon: <BsTable /> },
];

const ViewLayoutMenu: FC<ViewLayoutMenuProps> = ({ setLayoutView }) => {
  const [currentMenuItem, setCurrentMenuItem] = useState("Card View");

  function handleMenuItemClick(menuItem: string) {
    setLayoutView(menuItem);
    setCurrentMenuItem(menuItem);
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        data-cy={"MenuButton"}
        colorScheme={useColorModeValue("orange", "black")}
        size="lg"
        variant="ghost"
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
              clickHandler={handleMenuItemClick}
              currentMenuItem={currentMenuItem}
            />
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ViewLayoutMenu;
