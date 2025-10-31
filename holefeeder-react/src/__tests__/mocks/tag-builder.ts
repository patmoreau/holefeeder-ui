import { aCount, aString } from '@/__tests__';
import { Tag, TagResponse, toTag } from '@/features/purchase/core/tag';

const defaultData = (): TagResponse => ({
  tag: aString(),
  count: aCount(),
});

export const aTagResponse = (data: Partial<Tag> = {}): TagResponse => ({ ...defaultData(), ...data });

export const aTag = (data: Partial<Tag> = {}): Tag => toTag({ ...defaultData(), ...data });
