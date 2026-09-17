"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice, formatInstallment } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import ProductGallery from "@/components/ProductGallery";

export default function ProductDetail({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);
  const { addToCart } = useCart();
  const [tamanho, setTamanho] = useState("");
  const [hasAdded, setHasAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product.id, 1, tamanho.trim() || undefined);
    setHasAdded(true);
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="tamanho"
                className="text-sm font-medium text-preto/80"
              >
                Tamanho desejado (opcional)
              </label>
              <input
                id="tamanho"
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-full bg-bordo px-4 py-3 text-xs font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bordo/85"
            >
              Adicionar ao carrinho
            </button>

            {hasAdded && (
              <div className="flex flex-col gap-2 rounded-md bg-preto/5 px-4 py-3 text-sm">
                <span className="text-preto/70">
                  Peça adicionada ao carrinho ✓
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <Link href="/" className="font-medium text-bordo underline">
                    Adicionar mais itens
                  </Link>
                  <Link
                    href="/carrinho"
                    className="font-medium text-bordo underline"
                  >
                    Ver carrinho e finalizar compra
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
