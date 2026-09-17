"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImages,
} from "@/lib/products-client";
import type { Product } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/site-config";

export default function ProductForm({
  product,
  onSaved,
  onCancelEdit,
}: Readonly<{
  product?: Product | null;
  onSaved: () => void;
  onCancelEdit?: () => void;
}>) {
  const editing = Boolean(product);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<Category | "">("");
  const [descricao, setDescricao] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setNome(product?.nome ?? "");
    setPreco(product ? String(product.preco) : "");
    setCategoria(product?.categoria ?? "");
    setDescricao(product?.descricao ?? "");
    setExistingImages(product?.imagens ?? []);
    setNewFiles([]);
    setError(null);
  }, [product]);

  const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFiles]);

  function removeExistingImage(url: string) {
    setExistingImages((current) => current.filter((img) => img !== url));
  }

  function removeNewFile(index: number) {
    setNewFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const precoNum = Number(preco);
    if (!nome.trim()) {
      setError("Informe o nome da peça.");
      return;
    }
    if (!preco || Number.isNaN(precoNum) || precoNum <= 0) {
      setError("Informe um preço válido.");
      return;
    }
    if (!categoria) {
      setError("Selecione uma categoria válida.");
      return;
    }
    if (existingImages.length + newFiles.length === 0) {
      setError("Adicione ao menos uma foto da peça.");
      return;
    }

    setPending(true);
    try {
      const uploadedUrls = await uploadProductImages(newFiles);
      const imagens = [...existingImages, ...uploadedUrls];
      const input = {
        nome: nome.trim(),
        preco: precoNum,
        categoria,
        descricao: descricao.trim() || undefined,
        imagens,
      };

      if (editing && product) {
        await updateProductAndCleanup(product, existingImages, input);
      } else {
        await createProduct(input);
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao salvar a peça.",
      );
    } finally {
      setPending(false);
    }
  }

  async function updateProductAndCleanup(
    current: Product,
    keptImages: string[],
    input: {
      nome: string;
      preco: number;
      categoria: Category;
      descricao?: string;
      imagens: string[];
    },
  ) {
    await updateProduct(current.id, input);
    const removedImages = current.imagens.filter(
      (img) => !keptImages.includes(img),
    );
    await Promise.all(removedImages.map((url) => deleteProductImage(url)));
  }

  let submitLabel = "Salvar peça";
  if (pending) {
    submitLabel = "Salvando...";
  } else if (editing) {
    submitLabel = "Salvar alterações";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-preto/10 bg-off-white p-6"
    >
      <h2 className="text-lg font-semibold text-preto">
        {editing ? "Editar peça" : "Cadastrar nova peça"}
      </h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto/80">
          Nome
        </label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="preco" className="text-sm font-medium text-preto/80">
          Preço (R$)
        </label>
        <input
          id="preco"
          type="number"
          step="0.01"
          min="0"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="categoria"
          className="text-sm font-medium text-preto/80"
        >
          Categoria
        </label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Category)}
          required
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="descricao"
          className="text-sm font-medium text-preto/80"
        >
          Descrição (opcional)
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-preto/80">
          Fotos (pode selecionar mais de uma)
        </span>

        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((url) => (
              <div
                key={url}
                className="relative h-20 w-20 overflow-hidden rounded-md bg-creme"
              >
                <Image src={url} alt="Foto da peça" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  aria-label="Remover foto"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-preto/70 text-xs text-off-white"
                >
                  ×
                </button>
              </div>
            ))}
            {newPreviews.map((url, i) => (
              <div
                key={url}
                className="relative h-20 w-20 overflow-hidden rounded-md bg-creme"
              >
                <Image src={url} alt="Nova foto" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  aria-label="Remover foto"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-preto/70 text-xs text-off-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          id="imagens"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) =>
            setNewFiles((current) => [
              ...current,
              ...Array.from(e.target.files ?? []),
            ])
          }
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-md bg-bordo px-4 py-2 font-medium text-off-white transition-colors hover:bg-bordo/80 disabled:opacity-60"
        >
          {submitLabel}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-preto/20 px-4 py-2 font-medium text-preto/70 transition-colors hover:bg-preto/5"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

