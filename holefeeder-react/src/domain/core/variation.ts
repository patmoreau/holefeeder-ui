import { Result } from '@/domain/core/result';
import { createNumberValidator, Validate } from '@/domain/core/validate';

export type Variation = number & { readonly __brand: 'Variation' };

export const VariationErrors = {
  invalid: 'variation-invalid',
};

const isValidVariation = createNumberValidator<Variation>();

const create = (value: unknown): Result<Variation> => {
  const variationResult = Validate.validateWithErrors<Variation>(isValidVariation, value, [VariationErrors.invalid]);
  if (!variationResult.isSuccess) return variationResult;

  const variation = toCents(variationResult.value);

  return Result.success(fromCents(variation));
};

const valid = (value: number): Variation => value as Variation;

const toCents = (variation: Variation): number => Math.round(variation * 100);

const fromCents = (cents: number): Variation => {
  const value = cents / 100;
  return (Math.round(value * 100) / 100) as Variation;
};

const ZERO: Variation = 0 as Variation;

const sum = (...values: Variation[]): Variation => {
  const totalCents = values.reduce((acc, curr) => acc + toCents(curr), 0);
  return fromCents(totalCents);
};

const subtract = (a: Variation, b: Variation): Variation => {
  return fromCents(toCents(a) - toCents(b));
};

const multiply = (value: Variation, factor: number): Variation => {
  const resultCents = Math.round(toCents(value) * factor);
  return fromCents(resultCents);
};

export const Variation = {
  create: create,
  valid: valid,
  toCents: toCents,
  fromCents: fromCents,
  ZERO: ZERO,
  sum: sum,
  subtract: subtract,
  multiply: multiply,
} as const;
