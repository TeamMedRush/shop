import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";

import { Medicine } from "@interfaces/medince";

interface Entries {
  [medicineId: string]: {
    count: number;
    details: Medicine;
  };
};

interface CartMeta {
  count: number;
  entries: Entries;
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (medicineId: string) => void;
};

function createCartContext() {
  const CartContext = createContext<CartMeta | null>(null);

  function CartProvider({ children }: { children: ComponentChildren }) {
    const [localLoaded, setLocalLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [entries, setEntries] = useState<Entries>({});

    const addToCart = useCallback((medicine: Medicine) => {
      setCount(prevCount => prevCount + 1);

      setEntries(prevEntries => {
        const prevCount = prevEntries[medicine.id]?.count || 0;

        return {
          ...prevEntries,
          [medicine.id]: {
            count: prevCount + 1,
            details: medicine,
          }
        }
      });
    }, []);

    const removeFromCart = useCallback((medicineId: string) => {
      setEntries(prevEntries => {
        const prevCount = prevEntries[medicineId]?.count || 0;

        if (prevCount <= 1) {
          setCount(prevCount => prevCount - prevEntries[medicineId].count);
          const { [medicineId]: _, ...rest } = prevEntries;

          return rest;
        }

        setCount(prevCount => prevCount - 1);

        return {
          ...prevEntries,
          [medicineId]: {
            ...prevEntries[medicineId],
            count: prevCount - 1,
          }
        }
      });
    }, []);

    useEffect(() => {
      if (!localLoaded)
        return;

      localStorage.setItem("cart-entried", JSON.stringify(entries));
      localStorage.setItem("cart-count", count.toString());
    }, [localLoaded, entries, count]);

    useEffect(() => {
      const entries = localStorage.getItem("cart-entried");
      const count = localStorage.getItem("cart-count");

      if (entries) {
        setEntries(JSON.parse(entries));
      }

      if (count) {
        setCount(parseInt(count));
      }

      setLocalLoaded(true);
    }, []);

    const value = {
      count,
      entries,
      addToCart,
      removeFromCart,
    };

    return <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  }

  function useCart(): CartMeta {
    return useContext(CartContext)!;
  }

  return { useCart, CartProvider };
}

export const {
  useCart,
  CartProvider,
} = createCartContext();

