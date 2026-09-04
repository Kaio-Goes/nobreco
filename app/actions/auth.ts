"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const senha = formData.get("senha");

  if (typeof senha !== "string" || senha.length === 0) {
    return { error: "Informe a senha." };
  }

  if (senha !== process.env.ADMIN_PASSWORD) {
    return { error: "Senha incorreta." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
