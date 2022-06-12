import React, { FC } from "react";
import { MenuItem, useColorModeValue } from "@chakra-ui/react";

interface MenuItemOptionProps {
    title: string;
    icon: JSX.Element;
    clickHandler: (argument: string) => void;
    currentMenuItem: string;
}

export interface IMenuOption {
    title: string;
    icon: JSX.Element;
}

const MenuItemOption: FC<MenuItemOptionProps> = ({
    title,
    icon,
    clickHandler,
    currentMenuItem,
}) => {
    return (
        <MenuItem
            icon={icon}
            onClick={() => clickHandler(title)}
            bg={
                currentMenuItem === title
                    ? useColorModeValue("orange.100", "gray.600")
                    : "inherit"
            }
            data-cy={"MenuOption"}
        >
            {title}
        </MenuItem>
    );
};

export default MenuItemOption;
