"use client";

import type { Product } from "@/lib/products";
import { useFavorites } from "@/lib/use-favorites";
import ProductGrid from "./ProductGrid";

export default function FavoritesList({
  products,
}: Readonly<{ products: Product[] }>) {
  const { favorites } = useFavorites();
  const favoritedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <ProductGrid
      products={favoritedProducts}
      emptyMessage="Você ainda não tem favoritos. Toque no coração de uma peça para salvar aqui."
    />
  );
}
