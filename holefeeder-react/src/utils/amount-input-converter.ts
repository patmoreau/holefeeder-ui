export const amountInputConverter = (text: string, onDisplayValue: (value: string) => void, onAmountChange: (amount: number) => void) => {
  const digits = text.replace(/\D/g, '');

  if (digits === '') {
    onDisplayValue('');
    onAmountChange(0);
    return;
  }

  const numericValue = parseInt(digits, 10) / 100;

  const formatted = numericValue.toFixed(2);

  onDisplayValue(formatted);
  onAmountChange(numericValue);
};
