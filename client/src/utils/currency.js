// Converts USD base prices from API to INR (approx $1 = ₹85)
export const formatINR = (usdPrice) => {
  if (typeof usdPrice !== 'number') return '₹0';
  const inrPrice = Math.round(usdPrice * 85);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrPrice);
};