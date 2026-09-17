import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";

// .trim() evita mismatch de issuer/audience quando a env var tem espaço/quebra de linha extra.
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID não configurado (.env.local).",
  );
}

// Chaves públicas do Google usadas para assinar os ID tokens do Firebase Auth.
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

export async function verifyFirebaseIdToken(idToken: string) {
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (typeof payload.email !== "string") {
    throw new Error("Token do Firebase sem e-mail.");
  }

  return { email: payload.email, uid: payload.sub };
}
