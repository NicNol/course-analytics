import React, { FC } from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

interface StatProps {
  stat: number | string;
  icon: IconType;
  label: string;
}

const Stat: FC<StatProps> = ({ stat: reviews, icon, label }) => {
  return (
    <Flex gap={2} justifyContent={"flex-start"} align={"baseline"}>
      <Icon as={icon} w={8} h={8} alignSelf={"flex-end"} mb={1.5} />
      <Text
        fontSize={"3xl"}
        fontWeight={"light"}
        color={"fg"}
        data-cy={`Course-${label.replaceAll(" ", "-")}-Count`}
      >
        {reviews}
      </Text>
      <Text fontWeight={"bold"}>{label}</Text>
    </Flex>
  );
};

export default Stat;
