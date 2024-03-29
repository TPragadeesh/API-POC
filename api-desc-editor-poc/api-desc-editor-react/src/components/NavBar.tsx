import { HStack, Image } from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import ColorModeSwitch from "./ColorModeSwitch";
import logo from "../../public/logo.webp";

const NavBar = () => {
  return (
    <HStack padding="5px">
      <Image src={logo} boxSize="60px"></Image>
      <SearchBar />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
