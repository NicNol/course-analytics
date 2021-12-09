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

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue("black", "gray.900")}
            p={4}
            mt={12}
            color={"white"}
        >
            <Stack
                alignItems={"center"}
                justifyContent={"space-evenly"}
                direction={"row"}
            >
                <Stack>
                    <Text>
                        Course Analytics was developed for students of Oregon
                        State University&apos;s online Computer Science program.
                        The data on difficulty, time commitments, course
                        pairings, and tips have been submitted by real students
                        using{" "}
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeAWZa_OWYqwOte5yw4loGgE6hEUqOJOeSpmzStZF_HcufufQ/viewform">
                            this survey
                        </Link>
                        . Feel free to add your own reviews if you are a current
                        student! The data is scraped from{" "}
                        <Link href="https://docs.google.com/spreadsheets/d/1MFBGJbOXVjtThgj5b6K0rv9xdsC1M2GQ0pJVB-8YCeU/edit">
                            this spreadsheet
                        </Link>
                        .
                    </Text>
                    <Text>
                        Course Analytics is an open source project by{" "}
                        <Link href="https://github.com/NicNol">Nic Nolan</Link>.{" "}
                        <Link href="https://github.com/NicNol/course-analytics">
                            View the repository on GitHub
                        </Link>
                    </Text>
                </Stack>
            </Stack>
        </Box>
    );
}
