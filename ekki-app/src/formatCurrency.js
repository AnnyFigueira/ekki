export default function formatCurrency(value) {
  if(!value) return "0,00";
  return value.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
}