"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { buildWhatsappUrl } from "@/lib/site-config";

export default function CartView({
  products,
}: Readonly<{ products: Product[] }>) {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [nome, setNome] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product
        ? { product, quantidade: item.quantidade, tamanho: item.tamanho }
        : null;
    })
    .filter(
      (
        entry,
      ): entry is {
        product: Product;
        quantidade: number;
        tamanho: string | undefined;
      } => entry !== null,
    );

  const total = cartProducts.reduce(
    (sum, { product, quantidade }) => sum + product.preco * quantidade,
    0,
  );

  function handleFinalizar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const linhasItens = cartProducts.map(({ product, quantidade, tamanho }) => {
      const detalheTamanho = tamanho ? ` (tamanho ${tamanho})` : "";
      return `• ${quantidade}x ${product.nome}${detalheTamanho} - ${formatPrice(product.preco)} cada`;
    });

    const linhas = [
      "Olá! Quero finalizar essa compra:",
      ...linhasItens,
      `Total: ${formatPrice(total)}`,
      `Nome: ${nome}`,
      observacoes ? `Observações: ${observacoes}` : null,
    ].filter(Boolean);

    window.open(
      buildWhatsappUrl(linhas.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
    clearCart();
  }

  if (cartProducts.length === 0) {
    return (
      <p className="py-16 text-center text-preto/50">
        Seu carrinho está vazio.{" "}
        <Link href="/" className="font-medium text-bordo underline">
          Ver peças
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex flex-col gap-4">
        {cartProducts.map(({ product, quantidade, tamanho }) => (
          <li
            key={product.id}
            className="flex items-center gap-4 rounded-xl border border-preto/10 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-creme">
              {product.imagens[0] && (
                <Image
                  src={product.imagens[0]}
                  alt={product.nome}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-sm font-medium uppercase tracking-wide text-preto">
                {product.nome}
              </span>
              {tamanho && (
                <span className="text-xs text-preto/50">
                  Tamanho: {tamanho}
                </span>
              )}
              <span className="text-sm text-bordo">
                {formatPrice(product.preco)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantidade - 1)}
                  aria-label="Diminuir quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-preto/20 text-preto/70 hover:bg-preto/5"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{quantidade}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantidade + 1)}
                  aria-label="Aumentar quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-preto/20 text-preto/70 hover:bg-preto/5"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFromCart(product.id)}
              className="text-sm text-preto/40 transition-colors hover:text-bordo"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleFinalizar}
        className="flex flex-col gap-4 rounded-xl border border-preto/10 bg-white p-6"
      >
        <div className="flex items-center justify-between text-lg font-semibold text-preto">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium text-preto/80">
            Seu nome
          </label>
          <input
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="observacoes"
            className="text-sm font-medium text-preto/80"
          >
            Observações (opcional)
          </label>
          <textarea
            id="observacoes"
            rows={2}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-preto/20 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-preto/60 transition-colors hover:bg-preto/5"
          >
            Esvaziar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-bordo px-4 py-3 text-xs font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bordo/85"
          >
            Finalizar compra no WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
