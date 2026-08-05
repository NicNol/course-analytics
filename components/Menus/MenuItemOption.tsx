import React, { FC } from "react";
import { Menu, Span } from "@chakra-ui/react";

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
  const bgColor = { base: "orange.100", _dark: "gray.600" };
  return (
    <Menu.Item
      value={title}
      onClick={() => clickHandler(title)}
      _hover={{ backgroundColor: bgColor }}
      /* v3 drives the keyboard/pointer highlight off data-highlighted rather than focus. */
      _highlighted={{ backgroundColor: bgColor }}
      data-cy={"MenuOption"}
    >
      {/* v2's MenuItem `icon` prop rendered the icon in this wrapper. */}
      <Span display={"inline-flex"} alignItems={"center"} justifyContent={"center"} flexShrink={0} fontSize={"0.8em"} me={"0.75rem"}>
        {icon}
      </Span>
      {title}
    </Menu.Item>
  );
};

export default MenuItemOption;
