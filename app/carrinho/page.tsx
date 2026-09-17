import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products";
import CartView from "./cart-view";

export default async function CarrinhoPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-1 flex-col bg-off-white">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-semibold uppercase tracking-wide text-preto">
          Carrinho
        </h1>
        <CartView products={products} />
      </main>

      <Footer />
    </div>
  );
}
