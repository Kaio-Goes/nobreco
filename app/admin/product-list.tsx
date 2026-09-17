"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { deleteProduct } from "@/lib/products-client";
import { formatPrice } from "@/lib/format";

export default function ProductList({
  products,
  onEdit,
}: Readonly<{ products: Product[]; onEdit: (product: Product) => void }>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(product: Product) {
    if (
      !window.confirm(
        `Excluir "${product.nome}"? Essa ação não pode ser desfeita.`,
      )
    ) {
      return;
    }
    setError(null);
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id, product.imagens);
    } catch {
      setError("Falha ao excluir a peça. Tente novamente.");
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <p className="text-preto/60">Nenhuma peça cadastrada ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="flex flex-col gap-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-4 rounded-lg border border-preto/10 bg-off-white p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-creme">
              {product.imagens[0] && (
                <Image
                  src={product.imagens[0]}
                  alt={product.nome}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <span className="font-medium text-preto">{product.nome}</span>
              <span className="text-xs uppercase tracking-wide text-preto/40">
                {product.categoria} · {product.imagens.length}{" "}
                {product.imagens.length === 1 ? "foto" : "fotos"}
              </span>
              <span className="text-sm text-marrom">
                {formatPrice(product.preco)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onEdit(product)}
              className="rounded-md border border-preto/20 px-3 py-1.5 text-sm font-medium text-preto/70 transition-colors hover:bg-preto/5"
            >
              Editar
            </button>
            <button
              type="button"
              disabled={deletingId === product.id}
              onClick={() => handleDelete(product)}
              className="rounded-md border border-bordo px-3 py-1.5 text-sm font-medium text-bordo transition-colors hover:bg-bordo hover:text-off-white disabled:opacity-60"
            >
              {deletingId === product.id ? "Excluindo..." : "Excluir"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

