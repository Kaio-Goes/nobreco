export const siteConfig = {
  nome: "Nobreco",
  whatsappNumero: "5561993763638", // formato internacional, sem símbolos
};

export const CATEGORIES = ["Masculino", "Feminino", "Acessórios"] as const;
export type Category = (typeof CATEGORIES)[number];

export function buildWhatsappUrl(mensagem: string) {
  return `https://wa.me/${siteConfig.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}
