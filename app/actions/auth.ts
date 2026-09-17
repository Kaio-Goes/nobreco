"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/session";
import { verifyFirebaseIdToken } from "@/lib/firebase-verify";

export type LoginState = { error?: string } | undefined;

export async function loginWithFirebase(idToken: string): Promise<LoginState> {
  try {
    await verifyFirebaseIdToken(idToken);
  } catch {
    return { error: "Não foi possível validar seu login. Tente novamente." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}
