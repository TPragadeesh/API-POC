import { Button, List, ListItem } from "@chakra-ui/react";
import { FaRegCopy } from "react-icons/fa";
import { IoGitBranchOutline } from "react-icons/io5";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import useProjectViewStore from "../store/useProjectViewStore";

const ActivityBar = () => {
  const { setView } = useProjectViewStore();

  return (
    <List>
      <ListItem marginTop="10px">
        <Button
          whiteSpace="normal"
          variant="ghost"
          onClick={() => {
            setView("fs");
          }}
        >
          <FaRegCopy size="30px" />
        </Button>
      </ListItem>

      <ListItem marginTop="10px">
        <Button
          whiteSpace="normal"
          variant="ghost"
          onClick={() => {
            setView("vcs");
          }}
        >
          <IoGitBranchOutline size="30px" />
        </Button>
      </ListItem>

      <ListItem marginTop="10px">
        <Button
          whiteSpace="normal"
          variant="ghost"
          onClick={() => {
            setView("commit");
          }}
        >
          <RiGitRepositoryCommitsLine size="30px" />
        </Button>
      </ListItem>
    </List>
  );
};

export default ActivityBar;
