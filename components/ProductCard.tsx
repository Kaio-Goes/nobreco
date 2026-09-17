"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, formatInstallment } from "@/lib/format";
import BuyDialog from "./BuyDialog";

const SWIPE_THRESHOLD = 40;

export default function ProductCard({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    if (delta < 0) {
      goToNext();
    } else {
      goToPrev();
    }
  }

  function goToPrev() {
    const lastIndex = product.imagens.length - 1;
    setActiveImage((current) => (current === 0 ? lastIndex : current - 1));
  }

  function goToNext() {
    const lastIndex = product.imagens.length - 1;
    setActiveImage((current) => (current === lastIndex ? 0 : current + 1));
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-preto/5 transition-shadow duration-300 hover:shadow-lg">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-creme"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* todas as fotos ficam pré-carregadas empilhadas — só troca opacidade, sem delay de rede */}
        {product.imagens.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt={product.nome}
            fill
            className={`object-cover transition-opacity duration-200 ease-out group-hover:scale-105 ${
              product.esgotado ? "grayscale" : ""
            } ${i === activeImage ? "opacity-100" : "opacity-0"}`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ))}

        {product.esgotado && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-preto/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-off-white">
            Esgotado
          </span>
        )}

        {product.imagens.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Foto anterior"
              className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white transition-colors hover:bg-preto/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Próxima foto"
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-preto/40 text-off-white transition-colors hover:bg-preto/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

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
          </>
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
