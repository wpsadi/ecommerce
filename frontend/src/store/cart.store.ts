import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { queryClient } from "@/components/tanstack-provider";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface ICartStore {
  hydrated: boolean;
  items: CartItem[];
  removeItem(productId: string): void;
  increaseItemQuantity(productId: string): void;
  decreaseItemQuantity(productId: string): void;
  clearCart(): void;

  addItem(item: CartItem): void;

  setHydrated(): void;
}

export const useCartStore = create<ICartStore>()(
  persist(
    immer((set) => ({
      items: [],
      addItem(item) {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            state.items.push(item);
          }
        });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      },
      removeItem(productId) {
        set((state) => {
          state.items = state.items.filter((i) => i.productId !== productId);
        });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      },
      increaseItemQuantity(productId) {
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (item) {
            item.quantity += 1;
          }
        });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      },
      decreaseItemQuantity(productId) {
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else if (item) {
            state.items = state.items.filter((i) => i.productId !== productId);
          }
        });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      },
      clearCart() {
        set((state) => {
          state.items = [];
        });
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] });
      },

      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },
    })),
    {
      name: "cart",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
