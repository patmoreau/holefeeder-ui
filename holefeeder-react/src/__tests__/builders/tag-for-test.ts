import { Tag } from '@/use-cases/core/flows/tag';
import { aCount } from '../mocks/number-builder';
import { aString } from '../mocks/string-builder';

const defaultTag = (): Tag => ({
  tag: aString(),
  count: aCount(),
});

export const aTag = (overrides?: Partial<Tag>): Tag => ({
  ...defaultTag(),
  ...overrides,
});
