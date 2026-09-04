"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nobreco:favoritos";
const EVENT_NAME = "nobreco:favoritos-changed";

function readStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStoredFavorites(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT_NAME));
}

/** Favoritos persistidos no navegador (sem conta de usuário/backend). */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readStoredFavorites());
    sync();

    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    const current = readStoredFavorites();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    writeStoredFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}
