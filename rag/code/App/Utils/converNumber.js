export default (moneyAmount, decima) => {
  if (moneyAmount === undefined) {
    moneyAmount = 0;
  }
  moneyAmount = moneyAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${decima}`);
  return moneyAmount;
};

export function numberWithGroupSeparator(x, decimalPlaces) {
  const [integerPart, decimalPart] = x.toFixed(decimalPlaces).split('.');
  return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${decimalPart ? `.${decimalPart}` : ''}`;
}
