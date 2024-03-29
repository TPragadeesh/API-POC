import { HStack, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { LuFileJson } from "react-icons/lu";
import { LuSave } from "react-icons/lu";
import useFileStore from "../store/useFileStore";
import { TreeNodeModel } from "../model/TreeNodeModel";
import useFileTreeStore from "../store/useFileTreeStore";
import { RiDeleteBin4Line } from "react-icons/ri";

interface Props {
  node: TreeNodeModel;
}

const TreeNode = ({ node }: Props) => {
  const { updatedContent, setFileContent } = useFileStore();
  const { fileTree, setFileTree } = useFileTreeStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (node: TreeNodeModel) => {
    setIsOpen(!isOpen);
    if (!node.isDirectory) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFileContent(reader.result);
        }
      };
      node.fileHandle
        ?.getFile()
        .then((file) => {
          reader.readAsText(file);
        })
        .catch((error) => {
          console.log("Unable to read file content", error);
        });
    }
  };

  const handleSave = async () => {
    if (node && node.fileHandle) {
      try {
        const writable = await node.fileHandle.createWritable();
        await writable.write(updatedContent);
        await writable.close();

        // const updatedFileTree = propagateContentChange(
        //   fileTree,
        //   node.id,
        //   updatedContent
        // );
        // setFileTree(updatedFileTree);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };

  const propagateContentChange = (
    nodes: TreeNodeModel[],
    fileId: string,
    content: string
  ): TreeNodeModel[] => {
    return nodes.map((node) => {
      if (node.id === fileId) {
        return { ...node, content: content };
      } else if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: propagateContentChange(node.children, fileId, content),
        };
      }
      return node;
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
      if (node.fileHandle) {
        node.fileHandle
          .remove()
          .then(() => {
            const updatedFileTree = removeNodeFromTree(fileTree, node.id);
            setFileTree(updatedFileTree);
            setFileContent("");
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      }
    }
  };

  const removeNodeFromTree = (
    nodes: TreeNodeModel[],
    nodeId: string
  ): TreeNodeModel[] => {
    return nodes.filter((node) => {
      if (node.id === nodeId) {
        return false;
      } else if (node.children && node.children.length > 0) {
        node.children = removeNodeFromTree(node.children, nodeId);
      }
      return true;
    });
  };

  return (
    <div>
      <div style={{ cursor: "pointer" }}>
        {node.isDirectory && (
          <HStack onClick={() => handleToggle(node)}>
            <Icon as={isOpen ? IoIosArrowDown : IoIosArrowForward} />
            <Text fontSize={14}>{node.name}</Text>
          </HStack>
        )}
        {!node.isDirectory && (
          <HStack>
            <Icon as={LuFileJson} />
            <Text onClick={() => handleToggle(node)} fontSize={14}>
              {node.name}
            </Text>
            <Icon as={LuSave} onClick={() => handleSave()} />
            <Icon as={RiDeleteBin4Line} onClick={() => handleDelete()} />
          </HStack>
        )}
      </div>
      {isOpen && node.children && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((childNode) => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
