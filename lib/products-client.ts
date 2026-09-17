"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firestoreDb, firebaseStorage } from "@/lib/firestore";
import { PRODUCTS_COLLECTION } from "@/lib/products";
import type { Category } from "@/lib/site-config";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB

/** Envia as fotos pro Firebase Storage e retorna as URLs públicas, na mesma ordem. */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(
        "Formato de imagem não suportado (use PNG, JPEG ou WEBP).",
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Imagem muito grande (máx. 20MB).");
    }

    const extension = file.type.split("/")[1];
    const path = `produtos/${crypto.randomUUID()}.${extension}`;
    const storageRef = ref(firebaseStorage, path);
    await uploadBytes(storageRef, file);
    urls.push(await getDownloadURL(storageRef));
  }
  return urls;
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    await deleteObject(ref(firebaseStorage, url));
  } catch {
    // imagem já pode ter sido removida — ignora
  }
}

export type ProductInput = {
  nome: string;
  preco: number;
  categoria: Category;
  descricao: string;
  esgotado: boolean;
  imagens: string[];
};

export async function createProduct(input: ProductInput): Promise<void> {
  await addDoc(collection(firestoreDb, PRODUCTS_COLLECTION), {
    ...input,
    criadoEm: new Date().toISOString(),
  });
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  await updateDoc(doc(firestoreDb, PRODUCTS_COLLECTION, id), { ...input });
}

export async function deleteProduct(
  id: string,
  imagens: string[],
): Promise<void> {
  await deleteDoc(doc(firestoreDb, PRODUCTS_COLLECTION, id));
  await Promise.all(imagens.map((url) => deleteProductImage(url)));
}
