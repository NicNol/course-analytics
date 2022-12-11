import React, { FC } from "react";
import { Button, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

interface BackBreadcrumbProps {}

const BackBreadcrumb: FC<BackBreadcrumbProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Flex maxW={"1054px"} w={["100%", null, null, "1054px"]} p={2}>
        <Link as={NextLink} data-href={"/"} href={"/"} _hover={{}}>
          <Button
            leftIcon={<ArrowLeftIcon />}
            mt={4}
            variant={"ghost"}
            rounded={"xl"}
            colorScheme={useColorModeValue("orange", "black")}
            w={48}
          >
            Return to Courses
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default BackBreadcrumb;
