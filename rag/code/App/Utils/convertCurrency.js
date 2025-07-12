export default (moneyAmount: number) => {
  if (moneyAmount === undefined) {
    moneyAmount = 0;
  }
  moneyAmount = moneyAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return moneyAmount;
};

