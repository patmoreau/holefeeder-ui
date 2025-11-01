import { renderHook, RenderHookResult, act } from '@testing-library/react-native';
import { aTag } from '@/__tests__/mocks/tag-builder';
import { Tag } from '@/features/purchase/core/tag';
import { useTagList } from '@/features/purchase/core/use-tag-list';

const firstTag = aTag({ tag: 'first-tag' });
const middleTag = aTag({ tag: 'middle-tag' });
const lastTag = aTag({ tag: 'last-tag' });
const selectedTag = aTag({ tag: 'selected-tag' });
const newTag = aTag({ tag: 'new-tag', count: 0 });
const dTag = aTag({ tag: 'd', count: 0 });

describe('useTagList', () => {
  const mockOnChange = jest.fn();
  let hookResult: RenderHookResult<ReturnType<typeof useTagList>, { tags: Tag[]; selected: Tag[]; onChange: (next: Tag[]) => void }>;

  beforeEach(() => {
    mockOnChange.mockClear();
    hookResult = renderHook(
      ({ tags, selected, onChange }) =>
        useTagList({
          tags,
          selected,
          onChange,
        }),
      {
        initialProps: {
          tags: [firstTag, middleTag, lastTag, selectedTag],
          selected: [selectedTag],
          onChange: mockOnChange,
        },
      }
    );
  });

  it('initializes to empty filter', () => {
    expect(hookResult.result.current.filter).toBe('');
  });

  it('initializes to ordered list', () => {
    expect(hookResult.result.current.filtered).toStrictEqual([selectedTag, firstTag, middleTag, lastTag]);
  });

  describe('when toggling a tag', () => {
    it('toggle to selected on pressing an unselected tag', () => {
      act(() => {
        hookResult.result.current.toggleTag(middleTag);
      });

      expect(mockOnChange).toHaveBeenCalledWith([selectedTag, middleTag]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [selectedTag, middleTag],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([selectedTag, middleTag, firstTag, lastTag]);
    });

    it('toggle to unselected on pressing a selected tag', () => {
      act(() => {
        hookResult.result.current.toggleTag(selectedTag);
      });

      expect(mockOnChange).toHaveBeenCalledWith([]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([firstTag, middleTag, lastTag, selectedTag]);
    });
  });

  describe('when entering text', () => {
    it('shows tags matching the text', () => {
      act(() => {
        hookResult.result.current.setFilter('d');
      });

      expect(hookResult.result.current.filtered).toStrictEqual([selectedTag, middleTag]);
    });

    it('trim spaces', () => {
      act(() => {
        hookResult.result.current.setFilter(' d ');
      });

      expect(hookResult.result.current.filtered).toStrictEqual([selectedTag, middleTag]);
    });

    it('shows no tags on no match', () => {
      act(() => {
        hookResult.result.current.setFilter('z');
      });

      expect(hookResult.result.current.filtered).toStrictEqual([]);
    });

    it('on enter with exact single match, selects that tag and clears filter', () => {
      act(() => {
        hookResult.result.current.setFilter('mid');
      });

      act(() => {
        hookResult.result.current.onSubmit();
      });

      expect(mockOnChange).toHaveBeenCalledWith([middleTag, selectedTag]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [middleTag, selectedTag],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([middleTag, selectedTag, firstTag, lastTag]);
      expect(hookResult.result.current.filter).toBe('');
    });

    it('on pressing a tag, selects that tag and clears filter', () => {
      act(() => {
        hookResult.result.current.setFilter('mid');
      });

      act(() => {
        hookResult.result.current.toggleTag(middleTag);
      });

      expect(mockOnChange).toHaveBeenCalledWith([selectedTag, middleTag]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [selectedTag, middleTag],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([selectedTag, middleTag, firstTag, lastTag]);
      expect(hookResult.result.current.filter).toBe('');
    });

    it('on enter with multiple matches, creates a new lowercase tag and selects it, then clears filter', () => {
      act(() => {
        hookResult.result.current.setFilter(dTag.tag);
      });

      act(() => {
        hookResult.result.current.onSubmit();
      });

      expect(mockOnChange).toHaveBeenCalledWith([dTag, selectedTag]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [dTag, selectedTag],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([dTag, selectedTag, firstTag, middleTag, lastTag]);
      expect(hookResult.result.current.filter).toBe('');
    });

    it('on enter, add new tag to list and selects it', () => {
      act(() => {
        hookResult.result.current.setFilter(newTag.tag.toUpperCase());
      });

      act(() => {
        hookResult.result.current.onSubmit();
      });

      expect(mockOnChange).toHaveBeenCalledWith([newTag, selectedTag]);

      hookResult.rerender({
        tags: [firstTag, middleTag, lastTag, selectedTag],
        selected: [newTag, selectedTag],
        onChange: mockOnChange,
      });

      expect(hookResult.result.current.filtered).toStrictEqual([newTag, selectedTag, firstTag, middleTag, lastTag]);
      expect(hookResult.result.current.filter).toBe('');
    });
  });
});
