import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ISearchStore {
  hydrated: boolean;
  searchTerm: string;
  setSearchTerm(searchTerm: string): void;
  setHydrated(): void;
}

export const useSearchStore = create<ISearchStore>()(
  persist(
    immer((set) => ({
      searchTerm: "",
      setSearchTerm(searchTerm) {
        set((state) => {
          state.searchTerm = searchTerm;
        });
      },

      hydrated: false,
      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "search",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
