import Image from "next/image";
import type { Product } from "@/lib/products";
import BuyDialog from "./BuyDialog";

function formatPrice(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({
  product,
}: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-preto/5 transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-creme">
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-sm font-medium uppercase tracking-wide text-preto">
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="line-clamp-2 text-sm text-preto/60">
            {product.descricao}
          </p>
        )}
        <span className="text-lg font-semibold text-bordo">{preco}</span>

        <div className="mt-auto pt-3">
          <BuyDialog productName={product.nome} productPrice={preco} />
        </div>
      </div>
    </div>
  );
}
