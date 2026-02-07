import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type Tag = {
  tag: string;
  count: number;
};

export const TagErrors = {
  invalidName: 'invalid-name',
  invalidCount: 'invalid-count',
};

const schema = {
  $id: 'tag-name',
  type: 'string',
  minLength: 1,
};

const countSchema = {
  $id: 'tag-count',
  type: 'number',
  minimum: 0,
};

const create = (value: Record<string, unknown>): Result<Tag> => {
  return Result.combine<Tag>({
    tag: Validate.validateWithErrors(schema, value.tag, [TagErrors.invalidName]),
    count: Validate.validateWithErrors(countSchema, value.count, [TagErrors.invalidCount]),
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
