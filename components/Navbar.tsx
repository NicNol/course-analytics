import { ReactNode } from "react";
import {
    Box,
    Flex,
    Link,
    Button,
    useColorModeValue,
    Heading,
    Stack,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { Search2Icon, MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function Nav() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box bg={useColorModeValue("black", "gray.900")} px={4}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Box>
                    <Stack direction="row">
                        <Box grow="0">
                            <Search2Icon
                                w={16}
                                h={16}
                                color="white"
                                float="left"
                                m={2}
                                sx={{
                                    filter: "drop-shadow(3px 3px 3px #333);",
                                }}
                            />
                        </Box>
                        <Box>
                            <Heading
                                textShadow="2px 2px #333"
                                color={useColorModeValue(
                                    "orange.400",
                                    "rgb(160,174,192)"
                                )}
                            >
                                Course Analytics
                            </Heading>
                            <Text color="white" textShadow="1px 1px #333">
                                for Oregon State University&apos;s Computer
                                Science Post-Bacc Program
                            </Text>
                        </Box>
                    </Stack>
                </Box>

                <Button onClick={toggleColorMode} grow="0">
                    {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
            </Flex>
        </Box>
    );
}
