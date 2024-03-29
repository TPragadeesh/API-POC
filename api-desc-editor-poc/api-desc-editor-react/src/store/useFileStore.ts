import {create} from "zustand";
import {mountStoreDevtool} from "simple-zustand-devtools";

interface FileStore{
    fileContent: string;
    updatedContent: string;
    name: string;
    url: string;
    path: string;
    setFileContent: (fileContent: string) => void;
    setUpdatedContent: (fileContent: string) => void;
    setFileDetails: (name: string, url: string, path: string) => void;
}

const useFileStore = create<FileStore>(set =>({
    fileContent: "",
    updatedContent: "",
    name: "",
    url: "",
    path: "",
    setFileContent: (fileContent) => set(state=>({...state, fileContent: fileContent, updatedContent: fileContent})),
    setUpdatedContent: (updatedContent) => set(state=>({...state, updatedContent: updatedContent})),
    setFileDetails: (name, url, path) => set(state=>({...state, name: name, url: url, path: path}))
}));

mountStoreDevtool("File Store", useFileStore);

export default useFileStore;