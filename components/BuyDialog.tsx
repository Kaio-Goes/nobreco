"use client";

import { useRef, useState } from "react";
import { buildWhatsappUrl } from "@/lib/site-config";

type BuyDialogProps = {
  productName: string;
  productPrice: string;
};

export default function BuyDialog({ productName, productPrice }: Readonly<BuyDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [nome, setNome] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const linhas = [
      `Olá! Tenho interesse na peça *${productName}* (${productPrice}).`,
      `Nome: ${nome}`,
      tamanho ? `Tamanho: ${tamanho}` : null,
      observacoes ? `Observações: ${observacoes}` : null,
    ].filter(Boolean);

    window.open(buildWhatsappUrl(linhas.join("\n")), "_blank", "noopener,noreferrer");
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="w-full rounded-md bg-bordo px-4 py-2 text-sm font-medium text-off-white transition-colors hover:bg-bordo/80"
      >
        Comprar
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-sm rounded-lg border-none bg-off-white p-6 backdrop:bg-preto/60"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-preto">{productName}</h3>
            <p className="text-sm text-marrom">{productPrice}</p>
          </div>

          <p className="text-sm text-preto/70">
            Preencha seus dados e enviaremos sua solicitação direto para o nosso WhatsApp.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm font-medium text-preto/80">
              Seu nome
            </label>
            <input
              id="nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tamanho" className="text-sm font-medium text-preto/80">
              Tamanho desejado (opcional)
            </label>
            <input
              id="tamanho"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value)}
              className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="observacoes" className="text-sm font-medium text-preto/80">
              Observações (opcional)
            </label>
            <textarea
              id="observacoes"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="rounded-md border border-preto/20 bg-white px-3 py-2 text-preto outline-none focus:border-bordo"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="flex-1 rounded-md border border-preto/20 px-4 py-2 text-sm font-medium text-preto/70 hover:bg-preto/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-bordo px-4 py-2 text-sm font-medium text-off-white hover:bg-bordo/80"
            >
              Enviar no WhatsApp
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
