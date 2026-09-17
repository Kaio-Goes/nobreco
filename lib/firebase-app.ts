import { getApp, getApps, initializeApp } from "firebase/app";

// .trim() evita erro "Metadata string value ... contains illegal characters" quando a env var
// é configurada na plataforma de deploy com espaço/quebra de linha extra (ex: copy-paste).
const env = (v: string | undefined) => v?.trim();

const firebaseConfig = {
  apiKey: env(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: env(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: env(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  appId: env(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  storageBucket: env(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
};

// App do Firebase compartilhado entre client (browser) e server (RSC/Node) — sem Auth aqui,
// pra evitar inicializar firebase/auth (só suportado no browser) em código server-only.
export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
