import React, { FC } from "react";
import { MenuItem, useColorModeValue } from "@chakra-ui/react";

interface MenuItemOptionProps {
  title: string;
  icon: JSX.Element;
  clickHandler: (argument: string) => void;
}

export interface IMenuOption {
  title: string;
  icon: JSX.Element;
}

const MenuItemOption: FC<MenuItemOptionProps> = ({ title, icon, clickHandler }) => {
  const bgColor = useColorModeValue("orange.100", "gray.600");
  return (
    <MenuItem
      icon={icon}
      onClick={() => clickHandler(title)}
      _hover={{ backgroundColor: bgColor }}
      _focus={{ backgroundColor: bgColor }}
      data-cy={"MenuOption"}
    >
      {title}
    </MenuItem>
  );
};

export default MenuItemOption;
