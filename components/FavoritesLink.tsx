"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/use-favorites";

export default function FavoritesLink() {
  const { favorites } = useFavorites();

  return (
    <Link
      href="/favoritos"
      aria-label="Favoritos"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-preto transition-colors hover:bg-preto/5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={favorites.length > 0 ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      {favorites.length > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bordo text-[10px] font-semibold text-off-white">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
