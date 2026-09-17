"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDb } from "@/lib/firestore";
import { PRODUCTS_COLLECTION, type Product } from "@/lib/products";
import ProductForm from "./product-form";
import ProductList from "./product-list";

export default function AdminPanel({
  initialProducts,
}: Readonly<{ initialProducts: Product[] }>) {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[380px_1fr]">
      <div className="lg:sticky lg:top-8">
        <ProductForm
          product={editingProduct}
          onSaved={() => setEditingProduct(null)}
          onCancelEdit={() => setEditingProduct(null)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-preto">Peças cadastradas</h2>
        <ProductList products={products} onEdit={setEditingProduct} />
      </div>
    </div>
  );
}
