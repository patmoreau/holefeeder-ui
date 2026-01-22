import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React, { useState } from 'react';
import { aTag } from '@/__tests__/mocks/tag-builder';
import { aLightThemeState } from '@/__tests__/mocks/theme-state-builder';
import { Tag } from '@/features/purchase/core/tag';
import { TagList } from '@/features/purchase/ui/components/TagList';
import { useTheme } from '@/shared/hooks/theme/use-theme';

jest.mock('@/shared/hooks/theme/use-theme', () => ({
  useTheme: jest.fn(),
}));
const mockUseTheme = jest.mocked(useTheme);

const placeHolderText = 'tagList.placeHolder';
const firstTag = aTag({ tag: 'first-tag' });
const middleTag = aTag({ tag: 'middle-tag' });
const lastTag = aTag({ tag: 'last-tag' });
const selectedTag = aTag({ tag: 'selected-tag' });
const newTag = aTag({ tag: 'new-tag' });
const tagsPattern = new RegExp(`^#(?:${firstTag.tag}|${middleTag.tag}|${lastTag.tag}|${selectedTag.tag}|${newTag.tag})$`);

function TestHost() {
  const [selected, setSelected] = useState<Tag[]>([selectedTag]);
  return <TagList tags={[firstTag, middleTag, lastTag, selectedTag]} selected={selected} onChange={setSelected} />;
}

const displayTag = (tag: Tag) => `#${tag.tag}`;

describe('TagList', () => {
  const mockTheme = aLightThemeState();

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    render(<TestHost />);
  });

  it('shows placeholder', () => {
    expect(screen.queryByPlaceholderText(placeHolderText)).toBeOnTheScreen();
  });

  it('shows tags in order', () => {
    const tags = screen.queryAllByTestId(tagsPattern);

    expect(tags).toHaveLength(4);
    expect(tags.map((tag) => tag.props.children)).toEqual([
      displayTag(selectedTag),
      displayTag(firstTag),
      displayTag(middleTag),
      displayTag(lastTag),
    ]);
  });

  describe('when toggling a tag', () => {
    it('toggle to selected on pressing an unselected tag', () => {
      act(() => fireEvent.press(screen.getByTestId(displayTag(middleTag))));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(4);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(selectedTag),
        displayTag(middleTag),
        displayTag(firstTag),
        displayTag(lastTag),
      ]);
    });

    it('toggle to unselected on pressing a selected tag', () => {
      act(() => fireEvent.press(screen.getByTestId(displayTag(selectedTag))));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(4);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(firstTag),
        displayTag(middleTag),
        displayTag(lastTag),
        displayTag(selectedTag),
      ]);
    });
  });

  describe('when entering text', () => {
    it('shows tags matching the text', () => {
      act(() => fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), 'd'));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(2);
      expect(tags.map((tag) => tag.props.children)).toEqual([displayTag(selectedTag), displayTag(middleTag)]);
    });

    it('trim spaces', () => {
      act(() => fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), ' d '));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(2);
      expect(tags.map((tag) => tag.props.children)).toEqual([displayTag(selectedTag), displayTag(middleTag)]);
    });

    it('shows no tags on no match', () => {
      act(() => fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), 'z'));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags.length).toBe(0);
    });

    it('on enter with exact single match, selects that tag and clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);
      const add = screen.getByTestId('image-plus');

      act(() => fireEvent.changeText(input, 'mid'));
      act(() => fireEvent.press(add));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(4);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(middleTag),
        displayTag(selectedTag),
        displayTag(firstTag),
        displayTag(lastTag),
      ]);
    });

    it('on pressing a tag, selects that tag and clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);

      act(() => fireEvent.changeText(input, 'mid'));
      act(() => fireEvent.press(screen.getByTestId(displayTag(middleTag))));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(4);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(selectedTag),
        displayTag(middleTag),
        displayTag(firstTag),
        displayTag(lastTag),
      ]);
    });

    it('on enter with multiple matches, creates a new lowercase tag and selects it, then clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);
      const add = screen.getByTestId('image-plus');

      act(() => fireEvent.changeText(input, newTag.tag.toUpperCase()));
      act(() => fireEvent.press(add));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(5);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(newTag),
        displayTag(selectedTag),
        displayTag(firstTag),
        displayTag(middleTag),
        displayTag(lastTag),
      ]);
    });

    it('on enter, add new tag to list and selects it', () => {
      const input = screen.getByPlaceholderText(placeHolderText);
      const add = screen.getByTestId('image-plus');

      act(() => fireEvent.changeText(input, newTag.tag));
      act(() => fireEvent.press(add));

      const tags = screen.queryAllByTestId(tagsPattern);

      expect(tags).toHaveLength(5);
      expect(tags.map((tag) => tag.props.children)).toEqual([
        displayTag(newTag),
        displayTag(selectedTag),
        displayTag(firstTag),
        displayTag(middleTag),
        displayTag(lastTag),
      ]);
    });
  });
});
