import React, { FC } from "react";
import { Button, Flex, Link } from "@chakra-ui/react";
import { ArrowLeftIcon } from "../icons";
import NextLink from "next/link";

interface BackBreadcrumbProps {}

const BackBreadcrumb: FC<BackBreadcrumbProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Flex maxW={"1054px"} w={["100%", null, null, "1054px"]} p={2}>
        <Link asChild _hover={{}}>
          <NextLink data-href={"/"} href={"/"}>
            <Button
              mt={4}
              variant={"ghost"}
              rounded={"xl"}
              colorPalette={{ base: "orange", _dark: "black" }}
              w={48}
            >
              <ArrowLeftIcon />
              Return to Courses
            </Button>
          </NextLink>
        </Link>
      </Flex>
    </Flex>
  );
};

export default BackBreadcrumb;
