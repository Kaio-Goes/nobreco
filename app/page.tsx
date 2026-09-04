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

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[0.15em] text-preto">
            Peças
          </h2>
          <span className="h-[3px] w-10 rounded-full bg-bordo" />
        </div>
        <ProductGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}
