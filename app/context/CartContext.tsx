"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart";

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id
            ? { ...i, qty: i.qty + action.item.qty }
            : i
        );
      }
      return [...state, action.item];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "UPDATE_QTY":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("akwaaba_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadFromStorage);

  useEffect(() => {
    localStorage.setItem("akwaaba_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => dispatch({ type: "ADD", item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE", id });
  const updateQty = (id: string, qty: number) =>
    dispatch({ type: "UPDATE_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
