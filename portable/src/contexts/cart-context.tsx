import { ComponentChildren, createContext } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

import type { Product } from "@interfaces/app";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "medrush.shop.cart";
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as CartItem[] : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ComponentChildren }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  function addItem(product: Product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      const next = existing
        ? current.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item)
        : [...current, { product, quantity }];

      saveCart(next);
      return next;
    });
  }

  function removeItem(productId: string) {
    setItems((current) => {
      const next = current.filter((item) => item.product.id !== productId);
      saveCart(next);
      return next;
    });
  }

  function setQuantity(productId: string, quantity: number) {
    setItems((current) => {
      const next = current
        .map((item) => item.product.id === productId
          ? { ...item, quantity }
          : item)
        .filter((item) => item.quantity > 0);

      saveCart(next);
      return next;
    });
  }

  function clearCart() {
    setItems([]);
    saveCart([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) =>
    sum + item.product.price * item.quantity
  , 0);

  const value = useMemo<CartContextValue>(() => ({
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
  }), [items, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
