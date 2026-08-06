import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Search2Icon, MoonIcon, SunIcon } from "./icons";
import { useColorMode } from "./ui/color-mode";
import NextLink from "next/link";

export default function Nav() {
  const { toggleColorMode } = useColorMode();
  return (
    <Box
      bg={"chrome.bg"}
      color={"chrome.fg"}
      borderBottomWidth={"1px"}
      borderColor={"border"}
      px={4}
      flexGrow={0}
      pb={1}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Stack direction={"row"}>
            <Box>
              <Search2Icon w={16} h={16} color={"chrome.fg"} float={"left"} m={2} />
            </Box>
            <Box>
              <Link asChild _hover={{ textDecoration: "none" }}>
                <NextLink data-href={"/"} href={"/"}>
                  <Heading
                    size={{ base: "3xl", md: "4xl" }}
                    _hover={{
                      cursor: "pointer",
                      color: "colorPalette.200",
                    }}
                    transition={"color 0.2s ease-out"}
                    color={"white"}
                  >
                    Course Analytics
                  </Heading>
                </NextLink>
              </Link>
              <Text color={"gray.400"}>for Oregon State University&apos;s Computer Science Post-Bacc Program</Text>
            </Box>
          </Stack>
        </Box>

        <Button
          aria-label="Toggle Darkmode"
          onClick={toggleColorMode}
          variant={"ghost"}
          colorPalette={"gray"}
          color={"chrome.fg"}
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <MoonIcon display={{ base: "inline-block", _dark: "none" }} />
          <SunIcon display={{ base: "none", _dark: "inline-block" }} />
        </Button>
      </Flex>
    </Box>
  );
}
