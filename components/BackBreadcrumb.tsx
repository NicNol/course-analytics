import React, { FC } from "react";
import { useRouter } from "next/router";
import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";

interface BackBreadcrumbProps {}

const BackBreadcrumb: FC<BackBreadcrumbProps> = () => {
    const router = useRouter();

    return (
        <Flex justifyContent={"center"}>
            <Flex maxW={"1054px"} w={["100%", null, null, "1054px"]} p={2}>
                <Button
                    onClick={() => router.push("/")}
                    leftIcon={<ArrowLeftIcon />}
                    mt={4}
                    variant={"ghost"}
                    rounded={"xl"}
                    colorScheme={useColorModeValue("orange", "black")}
                    w={48}
                >
                    Return to Courses
                </Button>
            </Flex>
        </Flex>
    );
};

export default BackBreadcrumb;
