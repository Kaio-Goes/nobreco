import { siteConfig, buildWhatsappUrl } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-off-white/10 bg-azul-marinho px-6 py-10 text-off-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        <span className="text-lg font-semibold tracking-wide">NOBRECO</span>
        <p className="text-sm text-off-white/70">
          Peças selecionadas, compra combinada direto pelo WhatsApp.
        </p>
        <a
          href={buildWhatsappUrl(`Olá! Quero saber mais sobre as peças da ${siteConfig.nome}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm font-medium text-off-white underline underline-offset-4 hover:text-off-white/80"
        >
          Fale conosco no WhatsApp
        </a>
        <p className="mt-4 text-xs text-off-white/40">
          © {new Date().getFullYear()} {siteConfig.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
