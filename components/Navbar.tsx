import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Search2Icon, MoonIcon, SunIcon } from "./icons";
import { useColorMode } from "./ui/color-mode";
import NextLink from "next/link";

export default function Nav() {
  const { toggleColorMode } = useColorMode();
  return (
    <Box bg={{ base: "black", _dark: "gray.900" }} px={4} flexGrow={0} pb={1}>
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
                css={{
                  filter: "drop-shadow(3px 3px 3px #333)",
                }}
              />
            </Box>
            <Box>
              <Link asChild _hover={{}}>
                <NextLink data-href={"/"} href={"/"}>
                  <Heading
                    _hover={{
                      cursor: "pointer",
                      color: { base: "orange.300", _dark: "blue.200" },
                      textShadow: "1px 1px #999",
                    }}
                    transition={".2s"}
                    textShadow="2px 2px #333"
                    color={{ base: "orange.400", _dark: "rgb(160,174,192)" }}
                  >
                    Course Analytics
                  </Heading>
                </NextLink>
              </Link>
              <Text color={"white"} textShadow={"1px 1px #333"}>
                for Oregon State University&apos;s Computer Science Post-Bacc Program
              </Text>
            </Box>
          </Stack>
        </Box>

        {/* Both icons render and CSS picks one. Branching on colorMode here would
            mismatch during hydration, because the theme isn't known on the server. */}
        <Button aria-label="Toggle Darkmode" onClick={toggleColorMode}>
          <MoonIcon display={{ base: "inline-block", _dark: "none" }} />
          <SunIcon display={{ base: "none", _dark: "inline-block" }} />
        </Button>
      </Flex>
    </Box>
  );
}
