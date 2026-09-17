export const siteConfig = {
  nome: "Nobreco",
  whatsappNumero: "5561985874381", // formato internacional, sem símbolos
};

export const CATEGORIES = ["Masculino", "Acessórios"] as const;
export type Category = (typeof CATEGORIES)[number];

export function buildWhatsappUrl(mensagem: string) {
  return `https://wa.me/${siteConfig.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}
