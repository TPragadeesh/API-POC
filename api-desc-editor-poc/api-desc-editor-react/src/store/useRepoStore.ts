import { create } from "zustand";

interface RepoStore{
    currentRepo: string;
    setCurrentRepo: (repo: string)=>void;
}

const useRepoStore = create<RepoStore>(set=>({
    currentRepo: "",
    setCurrentRepo: (repo:string)=> set(()=>({currentRepo: repo}))
}));

export default useRepoStore;