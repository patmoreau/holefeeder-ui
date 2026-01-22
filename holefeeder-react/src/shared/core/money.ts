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

const create = (value: number): Result<Money> => {
  const rounded = Math.round(value * 100) / 100;
  return Validate.validateWithErrors<Money>(schema, rounded, [MoneyErrors.invalid]);
};

const valid = (value: number): Money => value as Money;

const toCents = (money: Money): number => Math.round(money * 100);

const fromCents = (cents: number): Money => (cents / 100) as Money;

const ZERO: Money = 0 as Money;

export const Money = { create: create, valid: valid, toCents: toCents, fromCents: fromCents, ZERO: ZERO } as const;
