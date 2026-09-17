"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, formatInstallment } from "@/lib/format";
import { useFavorites } from "@/lib/use-favorites";
import BuyDialog from "./BuyDialog";

export default function ProductCard({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorito = isFavorite(product.id);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-preto/5 transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-creme">
        <Image
          src={product.imagens[activeImage] ?? product.imagens[0]}
          alt={product.nome}
          fill
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            product.esgotado ? "grayscale" : ""
          }`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />

        {product.esgotado && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-preto/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-off-white">
            Esgotado
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label={
            favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-preto shadow-sm transition-colors hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            className={`h-4 w-4 ${favorito ? "text-bordo" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {product.imagens.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {product.imagens.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeImage
                    ? "w-4 bg-off-white"
                    : "w-1.5 bg-off-white/60 hover:bg-off-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] uppercase tracking-wide text-preto/40">
          {product.categoria}
        </span>
        <h3 className="text-sm font-medium uppercase tracking-wide text-preto">
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="line-clamp-2 text-sm text-preto/60">
            {product.descricao}
          </p>
        )}

        <div className="flex flex-col">
          <span className="text-lg font-semibold text-bordo">
            {preco} no Pix
          </span>
          <span className="text-xs text-preto/50">
            ou {formatInstallment(product.preco)}
          </span>
        </div>

        <div className="mt-auto pt-3">
          {product.esgotado ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-full bg-preto/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-preto/40"
            >
              Esgotado
            </button>
          ) : (
            <BuyDialog productName={product.nome} productPrice={preco} />
          )}
        </div>
      </div>
    </div>
  );
}
