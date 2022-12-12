import React, { FC } from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface StatProps {
  stat: number | string;
  icon: IconType;
  iconPosition: string;
  label: string;
}

const Stat: FC<StatProps> = ({ stat: reviews, icon, iconPosition, label }) => {
  return (
    <Flex gap={2} justifyContent={"flex-start"} align={"baseline"}>
      <Icon as={icon} w={8} h={8} pos={"relative"} top={iconPosition} />
      <Text fontSize={"3xl"} fontWeight={"100"} data-cy={`Course-${label.replaceAll(" ", "-")}-Count`}>
        {reviews}
      </Text>
      <Text fontWeight={"700"}>{label}</Text>
    </Flex>
  );
};

export default Stat;
