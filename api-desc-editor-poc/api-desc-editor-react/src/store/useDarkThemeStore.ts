import { create } from "zustand";

interface DarkThemeStore{
    theme: boolean;
    setTheme: (theme: boolean) => void;
}

const useDarkThemeStore = create<DarkThemeStore>(set=>({
    theme: true,
    setTheme: (theme: boolean) => set(()=>({theme: theme}))
}));

export default useDarkThemeStore;