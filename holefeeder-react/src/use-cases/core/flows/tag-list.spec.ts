import { TagList } from './tag-list';

describe('TagList', () => {
  it('should remove empty and duplicate tags', () => {
    const tags = ['tag1', 'tag2', ' tag1 ', 'tag3', 'tag2 ', ''];
    const result = TagList.create(tags);
    expect(result).toBeSuccessWithValue(['tag1', 'tag2', 'tag3']);
  });

  it('should return an empty array if the input is empty', () => {
    const tags: string[] = [];
    const result = TagList.create(tags);
    expect(result).toBeSuccessWithValue([]);
  });
});
