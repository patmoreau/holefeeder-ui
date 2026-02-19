import { Result } from '@/domain/core/result';
import { Validate, Validator } from '@/domain/core/validate';

export type Tag = {
  tag: string;
  count: number;
};

export const TagErrors = {
  invalidName: 'invalid-name',
  invalidCount: 'invalid-count',
};

const isValidTag = Validator.stringValidator({ minLength: 1 });
const isValidCount = Validator.numberValidator({ min: 0 });

const create = (value: Record<string, unknown>): Result<Tag> => {
  return Result.combine<Tag>({
    tag: Validate.validate(isValidTag, value.tag, [TagErrors.invalidName]),
    count: Validate.validate(isValidCount, value.count, [TagErrors.invalidCount]),
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
