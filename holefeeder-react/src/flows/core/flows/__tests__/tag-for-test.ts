import { Tag } from '@/flows/core/flows/tag';
import { aCount } from '@/shared/__tests__/number-for-test';
import { aString } from '@/shared/__tests__/string-for-test';

const defaultTag = (): Tag => ({
  tag: aString(),
  count: aCount(),
});

export const aTag = (overrides?: Partial<Tag>): Tag => ({
  ...defaultTag(),
  ...overrides,
});
