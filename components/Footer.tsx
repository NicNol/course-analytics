import { Box, Link, useColorModeValue, Heading, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg={useColorModeValue("black", "gray.900")} p={8} mt={12} color={"white"} flexGrow={0}>
      <Stack alignItems={"center"} justifyContent={"space-evenly"} direction={"row"}>
        <Stack maxW={"1200px"}>
          <Heading size={"lg"}>About: </Heading>
          <Text>
            Course Analytics was developed for students of Oregon State University&apos;s online Computer Science
            program. The data on difficulty, time commitments, course pairings, and tips have been submitted by real
            students using{" "}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform"
              color={useColorModeValue("orange.400", "blue.200")}
            >
              this survey
            </Link>
            . Feel free to add your own reviews if you are a current student! The data is scraped from{" "}
            <Link
              href="https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit"
              color={useColorModeValue("orange.400", "blue.200")}
            >
              this spreadsheet
            </Link>
            .
          </Text>
          <Text>
            Course Analytics is an open source project by{" "}
            <Link href="https://github.com/NicNol" color={useColorModeValue("orange.400", "blue.200")}>
              Nic Nolan
            </Link>
            .
            <br />
            <Link href="https://github.com/NicNol/course-analytics" color={useColorModeValue("orange.400", "blue.200")}>
              View the repository on GitHub
            </Link>
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
