import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "@/lib/firebase-app";

export const firestoreDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
