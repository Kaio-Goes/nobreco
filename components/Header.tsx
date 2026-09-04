import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, siteConfig, buildWhatsappUrl } from "@/lib/site-config";
import FavoritesLink from "./FavoritesLink";

export default function Header({
  initialQuery = "",
  activeCategories = [],
}: Readonly<{ initialQuery?: string; activeCategories?: string[] }>) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 bg-off-white/95 px-6 py-4 shadow-[0_1px_0_0_rgba(24,24,23,0.08)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logos/logo-01.svg"
            alt="Nobreco"
            width={36}
            height={36}
            priority
          />
          <span className="hidden text-lg font-semibold uppercase tracking-[0.2em] text-preto sm:block">
            Nobreco
          </span>
        </Link>

        <form
          action="/"
          className="flex max-w-md flex-1 items-center rounded-full border border-preto/15 bg-white px-4 py-2"
        >
          <input
            type="search"
            name="busca"
            defaultValue={initialQuery}
            placeholder="Buscar peças..."
            className="w-full bg-transparent text-sm text-preto outline-none placeholder:text-preto/40"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="text-preto/50 transition-colors hover:text-preto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.34-4.34m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z"
              />
            </svg>
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-1.5">
          <FavoritesLink />
          <a
            href={buildWhatsappUrl(
              `Olá! Quero saber mais sobre as peças da ${siteConfig.nome}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-bordo px-5 py-2 text-xs font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bordo/85 sm:block"
          >
            Fale conosco
          </a>
        </div>
      </div>

      <nav className="flex items-center gap-5 overflow-x-auto text-xs font-semibold uppercase tracking-wide text-preto/70">
        <Link
          href="/"
          className={`shrink-0 pb-1 transition-colors hover:text-preto ${
            activeCategories.length === 0
              ? "border-b-2 border-bordo text-preto"
              : ""
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map((categoria) => (
          <Link
            key={categoria}
            href={`/?categoria=${encodeURIComponent(categoria)}`}
            className={`shrink-0 pb-1 transition-colors hover:text-preto ${
              activeCategories.includes(categoria)
                ? "border-b-2 border-bordo text-preto"
                : ""
            }`}
          >
            {categoria}
          </Link>
        ))}
      </nav>
    </header>
  );
}
