"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firebaseAuth } from "@/lib/firebase-client";
import { firestoreDb } from "@/lib/firestore";
import { PRODUCTS_COLLECTION, type Product } from "@/lib/products";
import ProductForm from "./product-form";
import ProductList from "./product-list";

export default function AdminPanel({
  initialProducts,
}: Readonly<{ initialProducts: Product[] }>) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // cookie de sessão (7d) pode sobreviver mais que a sessão do Firebase Auth no navegador
  // (ex: iOS limpa o IndexedDB do site antes disso), daí o form carrega mas escritas falham
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // ao carregar a página o Firebase reporta "null" por um instante antes de
    // restaurar a sessão salva (IndexedDB é assíncrono) — espera um pouco antes
    // de considerar realmente expirada, senão o form fica bloqueado à toa
    let expiredTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (expiredTimer) {
        clearTimeout(expiredTimer);
        expiredTimer = null;
      }
      if (user) {
        setSessionExpired(false);
        return;
      }
      expiredTimer = setTimeout(() => setSessionExpired(true), 1500);
    });

    return () => {
      if (expiredTimer) clearTimeout(expiredTimer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const q = query(
      collection(firestoreDb, PRODUCTS_COLLECTION),
      orderBy("criadoEm", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      setProducts(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Product),
      );
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {sessionExpired && (
        <p className="rounded-md border border-bordo/30 bg-bordo/10 px-4 py-3 text-sm text-bordo">
          Sua sessão de login expirou. Para salvar alterações,{" "}
          <a href="/admin/login" className="font-semibold underline">
            saia e entre novamente
          </a>.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-8">
          <ProductForm
            product={editingProduct}
            disabled={sessionExpired}
            onSaved={() => setEditingProduct(null)}
            onCancelEdit={() => setEditingProduct(null)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-preto">
            Peças cadastradas
          </h2>
          <ProductList products={products} onEdit={setEditingProduct} />
        </div>
      </div>
    </div>
  );
}
