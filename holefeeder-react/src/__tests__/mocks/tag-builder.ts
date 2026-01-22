import { aCount } from '@/__tests__/mocks/number-builder';
import { aString } from '@/__tests__/mocks/string-builder';
import { Tag, TagResponse, toTag } from '@/features/purchase/core/tag';

const defaultData = (): TagResponse => ({
  tag: aString(),
  count: aCount(),
});

export const aTagResponse = (data: Partial<Tag> = {}): TagResponse => ({ ...defaultData(), ...data });

export const aTag = (data: Partial<Tag> = {}): Tag => toTag({ ...defaultData(), ...data });
