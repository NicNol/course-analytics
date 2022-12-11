import { Box, Button, Flex, Heading, Link, Stack, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Search2Icon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box bg={useColorModeValue("black", "gray.900")} px={4} flexGrow={0} pb={1}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Stack direction={"row"}>
            <Box>
              <Search2Icon
                w={16}
                h={16}
                color={"white"}
                float={"left"}
                m={2}
                sx={{
                  filter: "drop-shadow(3px 3px 3px #333);",
                }}
              />
            </Box>
            <Box>
              <Link as={NextLink} data-href={"/"} href={"/"} _hover={{}}>
                <Heading
                  _hover={{
                    cursor: "pointer",
                    color: useColorModeValue("orange.300", "blue.200"),
                    textShadow: "1px 1px #999",
                  }}
                  transition={".2s"}
                  textShadow="2px 2px #333"
                  color={useColorModeValue("orange.400", "rgb(160,174,192)")}
                >
                  Course Analytics
                </Heading>
              </Link>
              <Text color={"white"} textShadow={"1px 1px #333"}>
                for Oregon State University&apos;s Computer Science Post-Bacc Program
              </Text>
            </Box>
          </Stack>
        </Box>

        <Button aria-label="Toggle Darkmode" onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Flex>
    </Box>
  );
}
