import { create } from "zustand";

interface ProjectViewStore{
    view: string;
    setView: (view: string) => void;
}

const useProjectViewStore = create<ProjectViewStore>(set=>({
    view: "",
    setView: (view:string) => set(()=>({view: view}))
}));

export default useProjectViewStore;