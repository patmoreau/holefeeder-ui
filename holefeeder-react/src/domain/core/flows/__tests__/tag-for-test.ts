import { aCount } from '@/__tests__/mocks/number-for-test';
import { aString } from '@/__tests__/mocks/string-for-test';
import { Tag } from '@/domain/core/flows/tag';

const defaultTag = (): Tag => ({
  tag: aString(),
  count: aCount(),
});

export const aTag = (overrides?: Partial<Tag>): Tag => ({
  ...defaultTag(),
  ...overrides,
});
