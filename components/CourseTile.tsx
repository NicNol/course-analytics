import React, { FC } from "react";
import {
    Button,
    Box,
    Center,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import CourseTag from "./CourseTag";

interface CourseTileProps {
    Tags: Array<string>;
    Number: string;
    Title: string;
}

const CourseTile: FC<CourseTileProps> = ({ Tags, Number, Title }) => {
    let tags = Tags.map((tag) => (
        <CourseTag key={Number + tag}>{tag}</CourseTag>
    ));

    return (
        <Center py={6}>
            <Box
                maxW={"330px"}
                w={"full"}
                bg={useColorModeValue("orange.100", "gray.700")}
                boxShadow={"2xl"}
                rounded={"md"}
                overflow={"hidden"}
            >
                <Stack
                    justify={"center"}
                    p={6}
                    color={useColorModeValue("gray.800", "white")}
                    align={"center"}
                    direction={"row"}
                >
                    {tags}
                </Stack>
                <Text
                    align={"center"}
                    justify={"center"}
                    fontSize={"5xl"}
                    fontWeight={800}
                    textShadow={useColorModeValue(
                        "2px 2px #eee",
                        "2px 2px #333"
                    )}
                >
                    {Number}
                </Text>
                <Box bg="orange" px={6} py={10}>
                    <Text align={"center"} justify={"center"}>
                        {Title}
                    </Text>
                </Box>
                <Box
                    bg={useColorModeValue("gray.50", "gray.900")}
                    px={6}
                    py={10}
                >
                    <Text align={"center"} justify={"center"}>
                        100 Reviews
                    </Text>
                    <Button
                        mt={10}
                        w={"full"}
                        bg={"orange.400"}
                        color={"white"}
                        rounded={"xl"}
                        shadow={"md"}
                        _hover={{
                            bg: "orange.500",
                        }}
                        _focus={{
                            bg: "orange.500",
                        }}
                    >
                        See Analytics
                    </Button>
                </Box>
            </Box>
        </Center>
    );
};

export default CourseTile;
