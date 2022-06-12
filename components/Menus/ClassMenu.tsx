import React, { FC, useState } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
    ChevronDownIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    SettingsIcon,
    StarIcon,
    ViewIcon,
} from "@chakra-ui/icons";
import MenuItemOption, { IMenuOption } from "./MenuItemOption";

interface ClassMenuProps {
    handleFilter: (filter: string) => void;
}

const MenuOptions: IMenuOption[] = [
    { title: "All Classes", icon: <ViewIcon /> },
    { title: "Lower Division", icon: <ArrowDownIcon /> },
    { title: "Upper Division", icon: <ArrowUpIcon /> },
    { title: "Core Classes", icon: <SettingsIcon /> },
    { title: "Electives", icon: <StarIcon /> },
];

const ClassMenu: FC<ClassMenuProps> = ({ handleFilter }) => {
    const [currentMenuItem, setCurrentMenuItem] = useState("All Classes");

    function handleMenuItemClick(menuItem: string) {
        handleFilter(menuItem);
        setCurrentMenuItem(menuItem);
    }

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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

export default ClassMenu;
