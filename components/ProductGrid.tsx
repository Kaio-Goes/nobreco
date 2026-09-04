import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: Readonly<{ products: Product[] }>) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-preto/50">
        Em breve, novas peças por aqui.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
