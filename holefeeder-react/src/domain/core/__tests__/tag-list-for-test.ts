import { aWord } from '@/__tests__/mocks/string-for-test';
import { TagList } from '@/domain/core/flows/tag-list';

export const aTagList = () => TagList.valid([aWord(), aWord(), aWord()]);
