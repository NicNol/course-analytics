import React, { FC, useState } from "react";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { ChevronDownIcon } from "../icons";
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
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          data-cy={"MenuButton"}
          colorPalette={{ base: "orange", _dark: "black" }}
          size={"md"}
          variant={"ghost"}
          px={2}
        >
          {currentMenuItem}
          <ChevronDownIcon />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {MenuOptions.map((option) => {
              const { title, icon } = option;
              return <MenuItemOption key={title} title={title} icon={icon} clickHandler={handleMenuItemClick} />;
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ViewLayoutMenu;
