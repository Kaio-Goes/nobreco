"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImages,
} from "@/lib/products-client";
import type { Product } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/site-config";

function mapSaveError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code;
  if (code === "storage/unauthorized" || code === "permission-denied") {
    return "Sua sessão de login expirou. Saia e entre novamente para salvar.";
  }
  return err instanceof Error ? err.message : "Falha ao salvar a peça.";
}

export default function ProductForm({
  product,
  disabled,
  onSaved,
  onCancelEdit,
}: Readonly<{
  product?: Product | null;
  disabled?: boolean;
  onSaved: () => void;
  onCancelEdit?: () => void;
}>) {
  const editing = Boolean(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<Category | "">("");
  const [descricao, setDescricao] = useState("");
  const [esgotado, setEsgotado] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function resetForm() {
    setNome("");
    setPreco("");
    setCategoria("");
    setDescricao("");
    setEsgotado(false);
    setExistingImages([]);
    setNewFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    setNome(product?.nome ?? "");
    setPreco(product ? String(product.preco) : "");
    setCategoria(product?.categoria ?? "");
    setDescricao(product?.descricao ?? "");
    setEsgotado(product?.esgotado ?? false);
    setExistingImages(product?.imagens ?? []);
    setNewFiles([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  function addFiles(files: FileList | null) {
    if (!files) return;
    setNewFiles((current) => [...current, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (disabled) {
      setError(
        "Sua sessão de login expirou. Saia e entre novamente para salvar.",
      );
      return;
    }

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
        esgotado,
        imagens,
      };

      if (editing && product) {
        await updateProductAndCleanup(product, existingImages, input);
      } else {
        await createProduct(input);
        resetForm();
      }

      onSaved();
    } catch (err) {
      setError(mapSaveError(err));
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
      esgotado: boolean;
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
      className="flex flex-col gap-6 rounded-xl border border-preto/10 bg-off-white p-6 shadow-sm"
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
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none transition-colors focus:border-bordo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none transition-colors focus:border-bordo"
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
            className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none transition-colors focus:border-bordo"
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
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none transition-colors focus:border-bordo"
        />
      </div>

      <label className="flex items-center gap-2.5 rounded-md border border-preto/15 bg-white px-3 py-2.5 text-sm text-preto/80">
        <input
          type="checkbox"
          checked={esgotado}
          onChange={(e) => setEsgotado(e.target.checked)}
          className="h-4 w-4 rounded border-preto/30 text-bordo focus:ring-bordo"
        />
        <span>Marcar peça como esgotada</span>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-preto/80">Fotos</span>
        <span className="text-xs text-preto/50">
          Selecione quantas quiser — clique no quadrado com “+” para adicionar
          mais fotos.
        </span>

        <div className="flex flex-wrap gap-3">
          {existingImages.map((url) => (
            <div
              key={url}
              className="relative h-20 w-20 overflow-hidden rounded-md bg-creme ring-1 ring-preto/10"
            >
              <Image
                src={url}
                alt="Foto da peça"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                aria-label="Remover foto"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-preto/70 text-xs text-off-white transition-colors hover:bg-bordo"
              >
                ×
              </button>
            </div>
          ))}
          {newPreviews.map((url, i) => (
            <div
              key={url}
              className="relative h-20 w-20 overflow-hidden rounded-md bg-creme ring-1 ring-preto/10"
            >
              <Image src={url} alt="Nova foto" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                aria-label="Remover foto"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-preto/70 text-xs text-off-white transition-colors hover:bg-bordo"
              >
                ×
              </button>
            </div>
          ))}

          <label
            htmlFor="new-photo-input"
            aria-label="Adicionar fotos"
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-preto/25 text-preto/40 transition-colors hover:border-bordo hover:text-bordo"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[10px] font-medium uppercase tracking-wide">
              Adicionar
            </span>
          </label>
        </div>

        <input
          ref={fileInputRef}
          id="new-photo-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || disabled}
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
