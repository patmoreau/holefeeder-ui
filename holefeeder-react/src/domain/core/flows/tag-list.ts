import { Result } from '@/domain/core/result';
import { createArrayValidator, Validate } from '@/domain/core/validate';

export type TagList = string[] & { readonly __brand: 'TagList' };

export const TagListErrors = {
  invalid: 'tag-list-invalid',
};

const isString = (value: unknown): value is string => typeof value === 'string';
const isValidStringArray = createArrayValidator<string>(isString);

const create = (tags: unknown): Result<TagList> => {
  const tagsResult = Validate.validate<string[]>(isValidStringArray, tags);
  if (!tagsResult.isSuccess) return tagsResult;

  return Result.success(TagList.valid([...new Set(tagsResult.value.map((tag) => tag.trim()).filter((tag) => tag.length > 0))]));
};

const valid = (tags: string[]): TagList => tags as TagList;

export const TagList = {
  create: create,
  valid: valid,
};
