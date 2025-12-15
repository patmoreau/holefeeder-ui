// import i18n from 'i18next';

export const formatCurrency = (val: number, isEditing: boolean = false) => `${isEditing ? '' : '$'}${val.toFixed(2)}`;

export const formatPercentage = (val: number, isEditing: boolean = false) => `${val.toFixed(2)}${isEditing ? '' : '%'}`;

// const formatCurrencyIntl = (amount: number) => {
//   return new Intl.NumberFormat(i18n.language, {
//     style: 'currency',
//     currency: 'CAD', // Change to your currency code (USD, EUR, etc.)
//   }).format(amount);
// };
