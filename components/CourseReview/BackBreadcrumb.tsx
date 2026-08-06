import React, { FC } from "react";
import { Button, Flex, Link } from "@chakra-ui/react";
import { ArrowLeftIcon } from "../icons";
import NextLink from "next/link";

interface BackBreadcrumbProps {}

const BackBreadcrumb: FC<BackBreadcrumbProps> = () => {
  return (
    <Flex justifyContent={"center"}>
      <Flex maxW={"content"} w={["100%", null, null, "content"]} p={2}>
        <Link asChild _hover={{ textDecoration: "none" }}>
          <NextLink data-href={"/"} href={"/"}>
            <Button mt={4} w={48} variant={"outline"}>
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
