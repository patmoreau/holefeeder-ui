import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Money = number & { readonly __brand: 'Money' };

export const MoneyErrors = {
  invalid: 'money-invalid',
};

const schema = {
  $id: 'money',
  type: 'number',
  minimum: 0,
};

const create = (value: unknown): Result<Money> => {
  const moneyResult = Validate.validateWithErrors<Money>(schema, value, [MoneyErrors.invalid]);
  if (!moneyResult.isSuccess) return moneyResult;

  const money = toCents(moneyResult.value);

  return Result.success(fromCents(money));
};

const valid = (value: number): Money => value as Money;

const toCents = (money: Money): number => Math.round(money * 100);

const fromCents = (cents: number): Money => {
  const value = cents / 100;
  return (Math.round(value * 100) / 100) as Money;
};

const ZERO: Money = 0 as Money;

const sum = (...values: Money[]): Money => {
  const totalCents = values.reduce((acc, curr) => acc + toCents(curr), 0);
  return fromCents(totalCents);
};

const subtract = (a: Money, b: Money): Money => {
  return fromCents(toCents(a) - toCents(b));
};

const multiply = (value: Money, factor: number): Money => {
  const resultCents = Math.round(toCents(value) * factor);
  return fromCents(resultCents);
};

export const Money = {
  create: create,
  valid: valid,
  toCents: toCents,
  fromCents: fromCents,
  ZERO: ZERO,
  sum: sum,
  subtract: subtract,
  multiply: multiply,
} as const;
