import { useState } from "react";
import { HStack, Icon, ListItem, Text } from "@chakra-ui/react";
import { GitHubRepoTree } from "../model/GitHubRepoTree";
import { getGitHubRepoName } from "../utilities/getGitHubRepoName";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { LuFileJson } from "react-icons/lu";
import { GitHubFileContent } from "../model/GitHubFileContent";

interface Props {
  file: GitHubRepoTree;
  onFileSelect: (fileDetails: GitHubFileContent) => void;
}
const Directory = ({ file, onFileSelect }: Props) => {
  const [isExpanded, toggleExpanded] = useState(false);

  return (
    <>
      {file.type === "blob" && (
        <ListItem>
          <div
            style={{ cursor: "pointer" }}
            className="file-name"
            onClick={() => onFileSelect(file)}
          >
            <HStack marginLeft={2}>
              <Icon as={LuFileJson} />
              <Text>{getGitHubRepoName(file.name)}</Text>
            </HStack>
          </div>
        </ListItem>
      )}
      {file.type !== "blob" && (
        <div className="folder">
          {file.name && (
            <ListItem>
              <div
                className="folder-title"
                onClick={() => toggleExpanded(!isExpanded)}
              >
                <HStack>
                  <Icon
                    as={isExpanded ? IoIosArrowDown : IoIosArrowForward}
                    boxSize={4}
                  />
                  <Text fontSize={14}>{getGitHubRepoName(file.name)}</Text>
                </HStack>
              </div>
            </ListItem>
          )}
          {isExpanded &&
            file.items?.map((item, i) => (
              <Directory onFileSelect={onFileSelect} file={item} key={i} />
            ))}
        </div>
      )}
    </>
  );
};

export default Directory;
