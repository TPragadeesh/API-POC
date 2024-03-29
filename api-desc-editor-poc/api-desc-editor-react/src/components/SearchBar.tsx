import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";

const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (ref.current) {
            console.log(ref.current.value);
          }
        }}
      >
        <InputGroup>
          <InputLeftElement children={<BsSearch />}></InputLeftElement>
          <Input
            ref={ref}
            borderRadius={20}
            placeholder="Search files by name..."
            variant="filled"
          ></Input>
        </InputGroup>
      </form>
    </>
  );
};

export default SearchBar;
