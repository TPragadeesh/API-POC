import { create } from "zustand";

interface CommitStore{
    indexedDBKey: string;
    setIndexedDBKey: (key: string) => void;
}

const useCommitStore = create<CommitStore>(set=>({
    indexedDBKey: "",
    setIndexedDBKey: (key) => set(state=>({...state, indexedDBKey: key})),
}));


export default useCommitStore;