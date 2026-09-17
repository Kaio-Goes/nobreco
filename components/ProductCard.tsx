import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice, formatInstallment } from "@/lib/format";
import ProductGallery from "./ProductGallery";

export default function ProductCard({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-preto/5 transition-shadow duration-300 hover:shadow-lg"
    >
      <ProductGallery
        images={product.imagens}
        alt={product.nome}
        grayscale={product.esgotado}
        badge={
          product.esgotado && (
            <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-preto/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-off-white">
              Esgotado
            </span>
          )
        }
      />

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

        <span className="mt-auto pt-3 text-center text-xs font-semibold uppercase tracking-wide text-bordo transition-colors group-hover:text-bordo/80">
          {product.esgotado ? "Ver peça (esgotado)" : "Ver peça"}
        </span>
      </div>
    </Link>
  );
}
