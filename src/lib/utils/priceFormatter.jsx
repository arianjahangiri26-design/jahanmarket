export function priceFormatter(price) {
  return new Intl.NumberFormat("fa-IR").format(price);
}
