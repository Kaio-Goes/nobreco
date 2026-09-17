"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/site-config";

export default function FiltersSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = (searchParams.get("categoria") ?? "")
    .split(",")
    .filter(Boolean);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(
      params.size > 0 ? `${pathname}?${params.toString()}` : pathname,
      { scroll: false },
    );
  }

  function toggleCategoria(categoria: string) {
    updateParams((params) => {
      const current = new Set(selected);
      if (current.has(categoria)) {
        current.delete(categoria);
      } else {
        current.add(categoria);
      }
      if (current.size > 0) {
        params.set("categoria", Array.from(current).join(","));
      } else {
        params.delete("categoria");
      }
    });
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    updateParams((params) => {
      if (event.target.value === "recentes") {
        params.delete("ordenar");
      } else {
        params.set("ordenar", event.target.value);
      }
    });
  }

  return (
    <aside className="flex w-full flex-col gap-6 sm:w-52 sm:shrink-0">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-preto">
          Categoria
        </h3>
        <ul className="flex flex-col gap-2">
          {CATEGORIES.map((categoria) => (
            <li key={categoria}>
              <label className="flex items-center gap-2 text-sm text-preto/70">
                <input
                  type="checkbox"
                  checked={selected.includes(categoria)}
                  onChange={() => toggleCategoria(categoria)}
                  className="h-4 w-4 rounded border-preto/30 text-bordo focus:ring-bordo"
                />
                {categoria}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-preto">
          Ordenar por
        </h3>
        <select
          defaultValue={searchParams.get("ordenar") ?? "recentes"}
          onChange={handleSortChange}
          className="w-full rounded-md border border-preto/20 bg-white px-3 py-2 text-sm text-preto outline-none focus:border-bordo"
        >
          <option value="recentes">Mais recentes</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
        </select>
      </div>
    </aside>
  );
}
