"use client";

import { useActionState } from "react";
import { createProductAction } from "@/app/actions/products";

export default function ProductForm() {
  const [state, formAction, pending] = useActionState(createProductAction, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-preto/10 bg-off-white p-6"
    >
      <h2 className="text-lg font-semibold text-preto">Cadastrar nova peça</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-medium text-preto/80">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
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
          name="preco"
          type="number"
          step="0.01"
          min="0"
          required
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="descricao" className="text-sm font-medium text-preto/80">
          Descrição (opcional)
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="imagem" className="text-sm font-medium text-preto/80">
          Imagem
        </label>
        <input
          id="imagem"
          name="imagem"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          required
          className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-bordo px-4 py-2 font-medium text-off-white transition-colors hover:bg-bordo/80 disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar peça"}
      </button>
    </form>
  );
}
