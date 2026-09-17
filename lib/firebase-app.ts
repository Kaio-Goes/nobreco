import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// App do Firebase compartilhado entre client (browser) e server (RSC/Node) — sem Auth aqui,
// pra evitar inicializar firebase/auth (só suportado no browser) em código server-only.
export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
