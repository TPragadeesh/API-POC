import useFileTreeStore from "../store/useFileTreeStore";
import TreeNode from "./TreeNode";

const Tree = () => {
  const { fileTree } = useFileTreeStore();

  return (
    <>
      {fileTree.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </>
  );
};

export default Tree;
