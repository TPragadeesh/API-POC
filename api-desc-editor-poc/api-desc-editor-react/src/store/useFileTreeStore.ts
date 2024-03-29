import { create } from "zustand";
import { TreeNodeModel } from "../model/TreeNodeModel";

interface FileTreeStore{
    fileTree: TreeNodeModel[];
    setFileTree: (tree: TreeNodeModel[]) => void;
}

const useFileTreeStore = create<FileTreeStore>(set=>({
    fileTree: [],
    setFileTree: (tree) => set(()=>({fileTree: tree}))
}));

export default useFileTreeStore;