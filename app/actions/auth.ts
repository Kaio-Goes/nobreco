"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/session";
import { verifyFirebaseIdToken } from "@/lib/firebase-verify";

export type LoginState = { error?: string } | undefined;

export async function loginWithFirebase(idToken: string): Promise<LoginState> {
  let email: string;
  try {
    const payload = await verifyFirebaseIdToken(idToken);
    email = payload.email;
  } catch {
    return { error: "Não foi possível validar seu login. Tente novamente." };
  }

  const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!allowedEmail || email.toLowerCase() !== allowedEmail) {
    return { error: "Usuário não autorizado." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
