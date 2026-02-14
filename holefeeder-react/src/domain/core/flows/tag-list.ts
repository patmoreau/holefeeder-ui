import { Result } from '@/domain/core/result';
import { Validate } from '@/domain/core/validate';

export type TagList = string[] & { readonly __brand: 'TagList' };

export const TagListErrors = {
  invalid: 'tag-list-invalid',
};

const schema = {
  $id: 'tag-list',
  type: 'array',
  items: {
    type: 'string',
  },
};

const create = (tags: unknown): Result<TagList> => {
  const tagsResult = Validate.validate<string[]>(schema, tags);
  if (tagsResult.isFailure) return tagsResult;

  return Result.success([...new Set(tagsResult.value.map((tag) => tag.trim()).filter((tag) => tag.length > 0))] as TagList);
};

const valid = (tags: string[]): TagList => tags as TagList;

export const TagList = {
  create: create,
  valid: valid,
};
