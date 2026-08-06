import React, { FC } from "react";
import { Menu, Span } from "@chakra-ui/react";

interface MenuItemOptionProps {
  title: string;
  icon: React.JSX.Element;
  clickHandler: (argument: string) => void;
}

export interface IMenuOption {
  title: string;
  icon: React.JSX.Element;
}

const MenuItemOption: FC<MenuItemOptionProps> = ({ title, icon, clickHandler }) => {
  return (
    <Menu.Item
      value={title}
      onClick={() => clickHandler(title)}
      _hover={{ bg: "colorPalette.subtle" }}
      _highlighted={{ bg: "colorPalette.subtle" }}
      data-cy={"MenuOption"}
    >
      <Span
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexShrink={0}
        fontSize={"sm"}
        me={3}
      >
        {icon}
      </Span>
      {title}
    </Menu.Item>
  );
};

export default MenuItemOption;
