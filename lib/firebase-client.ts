import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase-app";

export const firebaseAuth = getAuth(firebaseApp);
