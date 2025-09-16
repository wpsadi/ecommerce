import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IProductStore {
  hydrated: boolean;
  viewMode: "grid" | "list";
  setViewMode(viewMode: "grid" | "list"): void;
  setHydrated(): void;
}

export const useProductStore = create<IProductStore>()(
  persist(
    immer((set) => ({
      viewMode: "grid",
      setViewMode(viewMode) {
        set((state) => {
          state.viewMode = viewMode;
        });
      },
      hydrated: false,
      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "products",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
