import Link from "next/link";

export default function Breadcrumb({
  categorias = [],
}: Readonly<{ categorias?: string[] }>) {
  const atual =
    categorias.length > 0 ? categorias.join(", ") : "Todas as peças";

  return (
    <nav className="flex items-center gap-2 text-xs text-preto/50">
      <Link href="/" className="hover:text-preto">
        Home
      </Link>
      <span>/</span>
      <span className="text-preto/80">{atual}</span>
    </nav>
  );
}
