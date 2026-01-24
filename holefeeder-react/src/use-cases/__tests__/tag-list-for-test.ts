import { aWord } from '@/__tests__/mocks/string-builder';
import { TagList } from '@/use-cases/core/flows/tag-list';

export const aTagList = () => TagList.valid([aWord(), aWord(), aWord()]);
