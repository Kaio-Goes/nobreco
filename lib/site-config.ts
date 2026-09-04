export const siteConfig = {
  nome: "Nobreco",
  whatsappNumero: "5561993763638", // formato internacional, sem símbolos
};

export function buildWhatsappUrl(mensagem: string) {
  return `https://wa.me/${siteConfig.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}
