export function formatPrice(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Preço "cheio" ilustrativo para exibir o parcelamento (Pix é o preço real cadastrado). */
export function formatInstallment(preco: number, parcelas = 6) {
  const valorParcela = preco / parcelas;
  return `${parcelas}x de ${formatPrice(valorParcela)} sem juros`;
}
