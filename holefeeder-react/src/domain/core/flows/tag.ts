import { Result } from '@/domain/core/result';
import { createNumberValidator, createStringValidator, Validate } from '@/domain/core/validate';

export type Tag = {
  tag: string;
  count: number;
};

export const TagErrors = {
  invalidName: 'invalid-name',
  invalidCount: 'invalid-count',
};

const isValidTag = createStringValidator({ minLength: 1 });
const isValidCount = createNumberValidator({ min: 0 });

const create = (value: Record<string, unknown>): Result<Tag> => {
  return Result.combine<Tag>({
    tag: Validate.validateWithErrors(isValidTag, value.tag, [TagErrors.invalidName]),
    count: Validate.validateWithErrors(isValidCount, value.count, [TagErrors.invalidCount]),
  });
};

const valid = (value: Record<string, unknown>): Tag => {
  return {
    tag: value.tag as string,
    count: value.count as number,
  };
};

export const Tag = {
  create: create,
  valid: valid,
};
