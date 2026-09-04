import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoritesList from "@/components/FavoritesList";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-1 flex-col bg-off-white">
      <TopBar />
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
        <h1 className="text-xl font-semibold uppercase tracking-[0.1em] text-preto">
          Favoritos
        </h1>
        <FavoritesList products={products} />
      </main>

      <Footer />
    </div>
  );
}
