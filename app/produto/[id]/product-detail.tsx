"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice, formatInstallment } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import ProductGallery from "@/components/ProductGallery";
import BuyDialog from "@/components/BuyDialog";

export default function ProductDetail({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product.id);
    setAdded(true);
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <ProductGallery
        images={product.imagens}
        alt={product.nome}
        grayscale={product.esgotado}
        sizes="(min-width: 768px) 45vw, 90vw"
        className="rounded-2xl"
        badge={
          product.esgotado && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-preto/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-off-white">
              Esgotado
            </span>
          )
        }
      />

      <div className="flex flex-col gap-4">
        <span className="text-xs uppercase tracking-wide text-preto/40">
          {product.categoria}
        </span>
        <h1 className="text-2xl font-semibold uppercase tracking-wide text-preto">
          {product.nome}
        </h1>
        {product.descricao && (
          <p className="text-sm leading-relaxed text-preto/70">
            {product.descricao}
          </p>
        )}

        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-bordo">
            {preco} no Pix
          </span>
          <span className="text-sm text-preto/50">
            ou {formatInstallment(product.preco)}
          </span>
        </div>

        {product.esgotado ? (
          <p className="rounded-md bg-preto/5 px-4 py-3 text-sm text-preto/60">
            Peça esgotada no momento.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-full border border-bordo px-4 py-3 text-xs font-semibold uppercase tracking-wide text-bordo transition-colors hover:bg-bordo/10"
              >
                {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
              </button>
              <div className="flex-1">
                <BuyDialog productName={product.nome} productPrice={preco} />
              </div>
            </div>

            {added && (
              <Link
                href="/carrinho"
                className="text-sm font-medium text-bordo underline"
              >
                Ver carrinho
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
