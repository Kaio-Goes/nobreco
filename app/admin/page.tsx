import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { getProducts } from "@/lib/products";
import { logout } from "@/app/actions/auth";
import ProductForm from "./product-form";
import ProductList from "./product-list";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = await getProducts();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-preto">Painel Nobreco</h1>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-preto/60 hover:text-preto">
            Sair
          </button>
        </form>
      </div>

      <ProductForm />

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-preto">Peças cadastradas</h2>
        <ProductList products={products} />
      </div>
    </div>
  );
}
