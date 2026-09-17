import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firestore";
import type { Category } from "@/lib/site-config";

export type Product = {
  id: string;
  nome: string;
  preco: number; // valor em reais
  categoria: Category;
  descricao?: string;
  esgotado?: boolean;
  imagens: string[]; // URLs das fotos no Firebase Storage (na ordem de exibição)
  criadoEm: string; // ISO date
};

export const PRODUCTS_COLLECTION = "produtos";

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(
    query(
      collection(firestoreDb, PRODUCTS_COLLECTION),
      orderBy("criadoEm", "desc"),
    ),
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const snapshot = await getDoc(doc(firestoreDb, PRODUCTS_COLLECTION, id));
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as Product)
    : undefined;
}
