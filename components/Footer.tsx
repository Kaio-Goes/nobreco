import { siteConfig, buildWhatsappUrl } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="relative bg-azul-marinho px-6 py-14 text-off-white">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-bordo" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <span className="text-lg font-semibold uppercase tracking-[0.25em]">
          Nobreco
        </span>
        <p className="text-sm text-off-white/70">
          Peças selecionadas, compra combinada direto pelo WhatsApp.
        </p>
        <a
          href={buildWhatsappUrl(
            `Olá! Quero saber mais sobre as peças da ${siteConfig.nome}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full border border-off-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-off-white/10"
        >
          Fale conosco no WhatsApp
        </a>
        <p className="mt-4 text-xs text-off-white/40">
          © {new Date().getFullYear()} {siteConfig.nome}. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
