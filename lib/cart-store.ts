"use client";

import { useCallback, useEffect, useState } from "react";

export type CartItem = { productId: string; quantidade: number };

const STORAGE_KEY = "nobreco:carrinho";
const EVENT_NAME = "nobreco:carrinho-changed";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

/** Carrinho persistido no navegador (sem conta de usuário/backend) — finalizado via WhatsApp. */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addToCart = useCallback((productId: string, quantidade = 1) => {
    const current = readCart();
    const exists = current.some((item) => item.productId === productId);
    const next = exists
      ? current.map((item) =>
          item.productId === productId
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        )
      : [...current, { productId, quantidade }];
    writeCart(next);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    writeCart(readCart().filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantidade: number) => {
      if (quantidade <= 0) {
        writeCart(readCart().filter((item) => item.productId !== productId));
        return;
      }
      writeCart(
        readCart().map((item) =>
          item.productId === productId ? { ...item, quantidade } : item,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => writeCart([]), []);

  const totalCount = items.reduce((sum, item) => sum + item.quantidade, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
  };
}
