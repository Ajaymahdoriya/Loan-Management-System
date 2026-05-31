export const calculateRepayment = (amount: number, tenureDays: number): number => {
  const rate = 12; // 12% p.a.
  const simpleInterest = (amount * rate * tenureDays) / (365 * 100);
  return amount + simpleInterest; // Total Repayment = P + SI
};