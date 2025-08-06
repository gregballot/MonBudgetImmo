export const formatCurrency = (value: number): string => {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
};

export const formatCurrencyPerMonth = (value: number): string => {
  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} € / mois`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)} %`;
};

export const formatYears = (value: number): string => {
  return `${value} ans`;
};
