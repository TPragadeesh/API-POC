import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";
import useDarkThemeStore from "../store/useDarkThemeStore";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { setTheme } = useDarkThemeStore();

  return (
    <HStack>
      <Switch
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={(event) => {
          toggleColorMode();
          setTheme(event.target.checked);
        }}
      ></Switch>
      <Text whiteSpace="nowrap">Dark mode</Text>
    </HStack>
  );
};

export default ColorModeSwitch;
