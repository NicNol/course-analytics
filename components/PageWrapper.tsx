import type { PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageWrapper({ children }: PropsWithChildren) {
  return (
    <Flex justifyContent={"space-between"} flexDirection={"column"} minH={"100vh"}>
      <Navbar />
      <Flex as={"main"} flexGrow={1} flexDirection={"column"} justifyContent={"flex-start"}>
        {children}
      </Flex>

      <Footer />
    </Flex>
  );
}
