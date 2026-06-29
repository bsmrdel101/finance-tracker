export const formatCurrency = (amount: any): string => {
  amount = parseFloat(amount);

  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';

  const absolute = Math.abs(amount);
  const [integerPart, decimalPart] = absolute.toFixed(2).split('.');
  const newIntPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `$${newIntPart}.${decimalPart}`;
};

export function groupBy<T, K extends string | number>(arr: T[], keyFn: (item: T) => K) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export const getMonthKey = (dateStr: string) => {
  const [year, month] = dateStr.split("-");
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  return `${monthNames[Number(month) - 1]} ${year}`;
};

export const isValidTransaction = (t: any) => {
  return (
    t &&
    typeof t.date === "string" &&
    t.date.includes("-") &&
    t.transactionId
  );
};
