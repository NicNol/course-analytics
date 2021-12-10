import React, { FC } from "react";
import { useRouter } from "next/router";
import { MdAccessTime, MdExtension, MdFeedback } from "react-icons/md";
import {
    Button,
    Box,
    Center,
    Icon,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import CourseTag from "./CourseTag";

interface CourseDetailBodyProps {}

const CourseDetailBody: FC<CourseDetailBodyProps> = () => {
    const router = useRouter();

    return (
        <Center p={2}>
            <Box
                maxW={"1054px"}
                w={"1054px"}
                bg={useColorModeValue("orange.100", "gray.700")}
                boxShadow={"2xl"}
                rounded={"md"}
                overflow={"hidden"}
            >
                <Stack
                    justify={"center"}
                    pt={6}
                    color={useColorModeValue("gray.800", "white")}
                    align={"center"}
                    direction={"row"}
                ></Stack>
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
                <Stack
                    align={"center"}
                    justify={"center"}
                    bg={useColorModeValue(
                        "rgb(68,68,68) linear-gradient(0deg, rgba(68,68,68,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(68,68,68,1) 100%)",
                        "rgb(160,174,192) linear-gradient(0deg, rgba(160,174,192,1) 0%, rgba(203,213,224,1) 10%, rgba(203,213,224,1) 90%, rgba(160,174,192,1) 100%)"
                    )}
                    h="64px"
                    px={8}
                >
                    <Text
                        align={"center"}
                        justify={"center"}
                        color={useColorModeValue("white", "black")}
                        fontWeight={"600"}
                    ></Text>
                </Stack>
                <Box
                    bg={useColorModeValue("#f5f5f5", "gray.900")}
                    px={6}
                    py={4}
                    align={"center"}
                >
                    <Stack color={useColorModeValue("#333", "#ccc")} ml={16}>
                        <Stack
                            direction={"row"}
                            justifyContent={"flex-start"}
                            align={"baseline"}
                        >
                            <Icon
                                as={MdFeedback}
                                w={8}
                                h={8}
                                pos={"relative"}
                                top={"8px"}
                            />
                            <Text fontSize={"3xl"} fontWeight={"100"}></Text>
                            <Text fontWeight={"700"}>Reviews</Text>
                        </Stack>
                        <Stack
                            direction={"row"}
                            justify={"flex-start"}
                            align={"baseline"}
                        >
                            <Icon
                                as={MdAccessTime}
                                w={8}
                                h={8}
                                pos={"relative"}
                                top={"5px"}
                            />
                            <Text fontSize={"3xl"} fontWeight={"100"}></Text>
                            <Text fontWeight={"700"}> Hours per Week</Text>
                        </Stack>
                        <Stack
                            direction={"row"}
                            justifyContent={"flex-start"}
                            align={"baseline"}
                        >
                            <Icon
                                as={MdExtension}
                                w={8}
                                h={8}
                                pos={"relative"}
                                top={"3px"}
                            />
                            <Text fontSize={"3xl"} fontWeight={"100"}></Text>
                            <Text fontWeight={"700"}>/ 5.0 Difficulty</Text>
                        </Stack>
                    </Stack>

                    <Button
                        onClick={() => router.push("/courses/" + Number)}
                        mt={4}
                        variant={"outline"}
                        borderColor={useColorModeValue(
                            "orange.300",
                            "gray.500"
                        )}
                        color={useColorModeValue("orange.400", "white")}
                        backgroundColor={useColorModeValue(
                            "orange.50",
                            "gray.700"
                        )}
                        rounded={"xl"}
                        shadow={"md"}
                        _hover={{
                            bg: useColorModeValue("orange.100", "gray.600"),
                            color: useColorModeValue("orange.500", "white"),
                        }}
                        _focus={{
                            bg: useColorModeValue("orange.100", "gray.600"),
                            color: useColorModeValue("orange.500", "white"),
                        }}
                        _active={{
                            bg: useColorModeValue("orange.200", "gray.400"),
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </Box>
        </Center>
    );
};

export default CourseDetailBody;
