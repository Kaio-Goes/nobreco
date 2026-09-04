import Image from "next/image";
import Link from "next/link";
import { siteConfig, buildWhatsappUrl } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-off-white/90 px-6 py-4 shadow-[0_1px_0_0_rgba(24,24,23,0.08)] backdrop-blur-md">
      <Link
        href="/"
        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <Image
          src="/logos/logo-01.svg"
          alt="Nobreco"
          width={36}
          height={36}
          priority
        />
        <span className="text-lg font-semibold uppercase tracking-[0.2em] text-preto">
          Nobreco
        </span>
      </Link>

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
    </header>
  );
}
