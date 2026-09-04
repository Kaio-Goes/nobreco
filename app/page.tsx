import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-1 flex-col bg-off-white">
      <Header />

      <HeroCarousel />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-12">
        <h2 className="text-xl font-semibold text-preto">Peças</h2>
        <ProductGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}
