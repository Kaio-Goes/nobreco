import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import Breadcrumb from "@/components/Breadcrumb";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";
import type { Category } from "@/lib/site-config";
import { CATEGORIES } from "@/lib/site-config";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const products = await getProducts();

  const activeCategories = (firstValue(params.categoria) ?? "")
    .split(",")
    .filter((categoria): categoria is Category =>
      CATEGORIES.includes(categoria as Category),
    );
  const busca = (firstValue(params.busca) ?? "").trim();
  const ordenar = firstValue(params.ordenar) ?? "recentes";

  let filteredProducts = products;
  if (activeCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      activeCategories.includes(p.categoria),
    );
  }
  if (busca) {
    const termo = busca.toLowerCase();
    filteredProducts = filteredProducts.filter((p) =>
      p.nome.toLowerCase().includes(termo),
    );
  }
  if (ordenar === "menor-preco") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.preco - b.preco);
  } else if (ordenar === "maior-preco") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.preco - a.preco);
  }

  return (
    <div className="flex flex-1 flex-col bg-off-white">
      <Header initialQuery={busca} />

      <HeroCarousel />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
        <Breadcrumb categorias={activeCategories} />

        <div className="flex flex-col gap-8 sm:flex-row">
          <Suspense fallback={null}>
            <FiltersSidebar />
          </Suspense>

          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold uppercase tracking-[0.1em] text-preto">
                Peças
              </h2>
              <span className="text-sm text-preto/50">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "peça" : "peças"}
              </span>
            </div>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
