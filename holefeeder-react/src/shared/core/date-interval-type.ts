import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export const DateIntervalTypes = {
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
  oneTime: 'oneTime',
} as const;

export type DateIntervalType = (typeof DateIntervalTypes)[keyof typeof DateIntervalTypes];

export const DateIntervalTypeErrors = {
  invalid: 'date-interval-type-invalid',
};

const schema = {
  $id: 'date-interval-type',
  enum: Object.values(DateIntervalTypes),
};

const create = (value: unknown): Result<DateIntervalType> => Validate.validateWithErrors(schema, value, [DateIntervalTypeErrors.invalid]);

export const DateIntervalType = {
  create: create,
};
