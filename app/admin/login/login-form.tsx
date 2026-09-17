"use client";

import { useState, useTransition } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { loginWithFirebase } from "@/app/actions/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      let idToken: string;
      try {
        const credential = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          senha,
        );
        idToken = await credential.user.getIdToken();
      } catch {
        setError("E-mail ou senha inválidos.");
        return;
      }

      // fora do try/catch: redirect() da server action lança um erro especial que
      // não pode ser capturado aqui, senão o Next mostra o catch antes de navegar.
      const result = await loginWithFirebase(idToken);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-off-white/80"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-off-white/20 bg-transparent px-3 py-2 text-off-white outline-none focus:border-off-white/60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="senha"
          className="text-sm font-medium text-off-white/80"
        >
          Senha
        </label>
        <input
          id="senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="rounded-md border border-off-white/20 bg-transparent px-3 py-2 text-off-white outline-none focus:border-off-white/60"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-bordo px-4 py-2 font-medium text-off-white transition-colors hover:bg-bordo/80 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
