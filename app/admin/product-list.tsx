import Image from "next/image";
import type { Product } from "@/lib/products";
import { deleteProductAction } from "@/app/actions/products";

function formatPrice(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductList({ products }: Readonly<{ products: Product[] }>) {
  if (products.length === 0) {
    return <p className="text-preto/60">Nenhuma peça cadastrada ainda.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex items-center gap-4 rounded-lg border border-preto/10 bg-off-white p-3"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-creme">
            <Image src={product.imagem} alt={product.nome} fill className="object-cover" />
          </div>

          <div className="flex flex-1 flex-col">
            <span className="font-medium text-preto">{product.nome}</span>
            <span className="text-sm text-marrom">{formatPrice(product.preco)}</span>
          </div>

          <form action={deleteProductAction.bind(null, product.id)}>
            <button
              type="submit"
              className="rounded-md border border-bordo px-3 py-1.5 text-sm font-medium text-bordo transition-colors hover:bg-bordo hover:text-off-white"
            >
              Excluir
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
