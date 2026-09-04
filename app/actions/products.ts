"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/session";
import { createProduct, deleteProduct, saveProductImage } from "@/lib/products";

export type ProductFormState = { error?: string } | undefined;

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Não autorizado.");
  }
}

export async function createProductAction(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const nome = formData.get("nome");
  const precoRaw = formData.get("preco");
  const descricao = formData.get("descricao");
  const imagem = formData.get("imagem");

  if (typeof nome !== "string" || nome.trim().length === 0) {
    return { error: "Informe o nome da peça." };
  }

  const preco = Number(precoRaw);
  if (!precoRaw || Number.isNaN(preco) || preco <= 0) {
    return { error: "Informe um preço válido." };
  }

  if (!(imagem instanceof File) || imagem.size === 0) {
    return { error: "Selecione uma imagem para a peça." };
  }

  let imagemPath: string;
  try {
    imagemPath = await saveProductImage(imagem);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Falha ao salvar a imagem." };
  }

  await createProduct({
    nome: nome.trim(),
    preco,
    descricao: typeof descricao === "string" && descricao.trim() ? descricao.trim() : undefined,
    imagem: imagemPath,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/admin");
}
