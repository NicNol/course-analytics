import { Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageWrapper(props: any) {
    return (
        <Flex
            justifyContent={"space-between"}
            flexDirection={"column"}
            minH={"100vh"}
        >
            <Navbar />
            <Flex
                flexGrow={1}
                flexDirection={"column"}
                justifyContent={"flex-start"}
            >
                {props.children}
            </Flex>

            <Footer />
        </Flex>
    );
}
