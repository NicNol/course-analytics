import { Box, Link, Heading, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      bg={"chrome.bg"}
      p={8}
      mt={12}
      color={"chrome.fg"}
      borderTopWidth={"1px"}
      borderColor={"border"}
      flexGrow={0}
    >
      <Stack alignItems={"center"} justifyContent={"space-evenly"} direction={"row"}>
        <Stack maxW={"1200px"}>
          <Heading size={"lg"}>About: </Heading>
          <Text>
            Course Analytics was developed for students of Oregon State University&apos;s online Computer Science
            program. The data on difficulty, time commitments, course pairings, and tips have been submitted by real
            students using{" "}
            <Link
              variant={"underline"}
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform"
              color={"colorPalette.300"}
            >
              this survey
            </Link>
            . Feel free to add your own reviews if you are a current student! The data is scraped from{" "}
            <Link
              variant={"underline"}
              href="https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit"
              color={"colorPalette.300"}
            >
              this spreadsheet
            </Link>
            .
          </Text>
          <Text>
            Course Analytics is an open source project by{" "}
            <Link variant={"underline"} href="https://github.com/NicNol" color={"colorPalette.300"}>
              Nic Nolan
            </Link>
            .
            <br />
            <Link variant={"underline"} href="https://github.com/NicNol/course-analytics" color={"colorPalette.300"}>
              View the repository on GitHub
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
