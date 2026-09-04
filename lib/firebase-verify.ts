import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

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
