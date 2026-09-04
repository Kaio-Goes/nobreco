import Image from "next/image";
import type { Product } from "@/lib/products";
import BuyDialog from "./BuyDialog";

function formatPrice(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({ product }: Readonly<{ product: Product }>) {
  const preco = formatPrice(product.preco);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-preto/10 bg-white">
      <div className="relative aspect-[3/4] w-full bg-creme">
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-medium text-preto">{product.nome}</h3>
        {product.descricao && (
          <p className="line-clamp-2 text-sm text-preto/60">{product.descricao}</p>
        )}
        <span className="text-lg font-semibold text-marrom">{preco}</span>

        <div className="mt-auto pt-2">
          <BuyDialog productName={product.nome} productPrice={preco} />
        </div>
      </div>
    </div>
  );
}
