import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-preto/10 bg-off-white/95 px-6 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logos/logo-01.svg"
          alt="Nobreco"
          width={40}
          height={40}
          priority
        />
        <span className="text-lg font-semibold tracking-wide text-preto">
          NOBRECO
        </span>
      </Link>
    </header>
  );
}
