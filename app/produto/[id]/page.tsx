import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { getProductById } from "@/lib/products";
import ProductDetail from "./product-detail";

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="flex flex-1 flex-col bg-off-white">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <Breadcrumb categorias={[product.categoria]} />

        <Link
          href="/"
          className="w-fit text-xs font-medium text-preto/50 transition-colors hover:text-preto"
        >
          ← Ver todas as peças
        </Link>

        <ProductDetail product={product} />
      </main>

      <Footer />
    </div>
  );
}
