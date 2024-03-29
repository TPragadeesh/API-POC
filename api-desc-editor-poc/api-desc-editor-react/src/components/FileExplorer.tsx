import { Button, Link, Text, VStack } from "@chakra-ui/react";
import { fileDefaultMessage, openFolder } from "../helpers/Constants";
import Tree from "./Tree";
import useFileTreeStore from "../store/useFileTreeStore";
import { TreeNodeModel } from "../model/TreeNodeModel";
import IndexedDBService from "../services/IndexedDBService";
import { getDirectoryHandle } from "../indexedDB/getDirectoryHandle";
import { useEffect, useState } from "react";

const FileExplorer = () => {
  const [recentFiles, setRecentFiles] = useState<IDBValidKey[]>([]);
  const { fileTree, setFileTree } = useFileTreeStore();

  let indexedDBService = new IndexedDBService();

  useEffect(() => {
    indexedDBService
      .getAllFileHandlesKeys()
      .then((keys) => setRecentFiles(keys));
  }, []);

  const handleOpenDirectory = async (key: string) => {
    await getDirectoryHandle(key).then((directoryHandle) => {
      buildFileTree(directoryHandle).then((treeNodes) => {
        setFileTree(treeNodes);
      });
    });
  };

  const handleSelectFolder = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      indexedDBService.updateFileHandlesStore(
        directoryHandle.name,
        directoryHandle
      );
      const treeNodes = await buildFileTree(directoryHandle);
      setFileTree(treeNodes);
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  const buildFileTree = async (
    directoryHandle: FileSystemFileHandle | FileSystemDirectoryHandle
  ): Promise<TreeNodeModel[]> => {
    const children: TreeNodeModel[] = [];
    for await (const entry of directoryHandle.values()) {
      const node: TreeNodeModel = {
        id: entry.name,
        name: entry.name,
        isDirectory: entry.kind === "directory",
      };
      if (entry.kind === "directory") {
        node.children = await buildFileTree(entry);
      }
      if (entry.kind === "file") {
        node.fileHandle = entry;
      }
      children.push(node);
    }
    // Sort folders first, then files
    children.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    return children;
  };

  return (
    <>
      {fileTree.length == 0 && (
        <VStack>
          <Text fontSize={14} padding={5}>
            {fileDefaultMessage}
          </Text>
          <Button
            padding={2}
            colorScheme="blue"
            size="md"
            width="90%"
            fontSize={14}
            onClick={handleSelectFolder}
          >
            {openFolder}
          </Button>

          {recentFiles.length > 0 && (
            <>
              <Text fontSize={16}>Recent</Text>
              {recentFiles.map((file, index) => (
                <Link
                  key={index}
                  onClick={() => handleOpenDirectory(file.toString())}
                >
                  {file.toString()}
                </Link>
              ))}
            </>
          )}
        </VStack>
      )}
      <Tree />
    </>
  );
};

export default FileExplorer;
