import { fireEvent, render, screen } from '@testing-library/react-native';
import React, { useState } from 'react';
import { aLightThemeState } from '@/__tests__';
import { aTag } from '@/__tests__/mocks/tag-builder';
import { Tag } from '@/features/purchase/core/tag';
import { TagList } from '@/features/purchase/ui/components/TagList';
import { useTheme } from '@/shared/hooks/theme/use-theme';

jest.mock('@/shared/hooks/theme/use-theme', () => ({
  useTheme: jest.fn(),
}));
const mockUseTheme = jest.mocked(useTheme);

const placeHolderText = 'my filter tag';
const firstTag = aTag({ tag: 'first-tag' });
const middleTag = aTag({ tag: 'middle-tag' });
const lastTag = aTag({ tag: 'last-tag' });
const selectedTag = aTag({ tag: 'selected-tag' });
const newTag = aTag({ tag: 'new-tag' });
const tagsPattern = new RegExp(`^(?:${firstTag.tag}|${middleTag.tag}|${lastTag.tag}|${selectedTag.tag}|${newTag.tag})$`);

function TestHost() {
  const [selected, setSelected] = useState<Tag[]>([selectedTag]);
  return (
    <TagList placeholder={placeHolderText} tags={[firstTag, middleTag, lastTag, selectedTag]} selected={selected} onChange={setSelected} />
  );
}

describe('TagList', () => {
  const mockTheme = aLightThemeState();

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    render(<TestHost />);
    screen.debug();
  });

  it('shows placeholder', () => {
    expect(screen.queryByPlaceholderText('my filter tag')).toBeOnTheScreen();
  });

  it('shows tags in order', () => {
    const tags = screen.queryAllByText(tagsPattern);

    expect(tags[0]).toHaveTextContent(selectedTag.tag);
    expect(tags[1]).toHaveTextContent(firstTag.tag);
    expect(tags[2]).toHaveTextContent(middleTag.tag);
    expect(tags[3]).toHaveTextContent(lastTag.tag);
  });

  describe('when toggling a tag', () => {
    it('toggle to selected on pressing an unselected tag', () => {
      fireEvent.press(screen.getByText(middleTag.tag));

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(selectedTag.tag);
      expect(tags[1]).toHaveTextContent(middleTag.tag);
      expect(tags[2]).toHaveTextContent(firstTag.tag);
      expect(tags[3]).toHaveTextContent(lastTag.tag);
    });

    it('toggle to unselected on pressing a selected tag', () => {
      fireEvent.press(screen.getByText(selectedTag.tag));

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(firstTag.tag);
      expect(tags[1]).toHaveTextContent(middleTag.tag);
      expect(tags[2]).toHaveTextContent(lastTag.tag);
      expect(tags[3]).toHaveTextContent(selectedTag.tag);
    });
  });

  describe('when entering text', () => {
    it('shows tags matching the text', () => {
      fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), 'd');

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(selectedTag.tag);
      expect(tags[1]).toHaveTextContent(middleTag.tag);
    });

    it('trim spaces', () => {
      fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), ' d ');

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(selectedTag.tag);
      expect(tags[1]).toHaveTextContent(middleTag.tag);
    });

    it('shows no tags on no match', () => {
      fireEvent.changeText(screen.getByPlaceholderText(placeHolderText), 'z');

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags.length).toBe(0);
    });

    it('on enter with exact single match, selects that tag and clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);

      fireEvent.changeText(input, 'mid'); // matches only middle-tag
      fireEvent(input, 'submitEditing', { nativeEvent: { text: 'mid' } });

      const tags = screen.queryAllByText(tagsPattern);

      // newest-first in selected on Enter
      expect(tags[0]).toHaveTextContent(middleTag.tag);
      expect(tags[1]).toHaveTextContent(selectedTag.tag);
      expect(tags[2]).toHaveTextContent(firstTag.tag);
      expect(tags[3]).toHaveTextContent(lastTag.tag);

      // input cleared implies a full list shown again (filtered reset)
      expect(screen.getByPlaceholderText(placeHolderText).props.value).toBe('');
    });

    it('on pressing a tag, selects that tag and clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);

      fireEvent.changeText(input, 'mid');
      fireEvent.press(screen.getByText(middleTag.tag));

      const tags = screen.queryAllByText(tagsPattern);

      // newest-first in selected on Enter
      expect(tags[0]).toHaveTextContent(selectedTag.tag);
      expect(tags[1]).toHaveTextContent(middleTag.tag);
      expect(tags[2]).toHaveTextContent(firstTag.tag);
      expect(tags[3]).toHaveTextContent(lastTag.tag);

      // input cleared implies a full list shown again (filtered reset)
      expect(screen.getByPlaceholderText(placeHolderText).props.value).toBe('');
    });

    it('on enter with multiple matches, creates a new lowercase tag and selects it, then clears filter', () => {
      const input = screen.getByPlaceholderText(placeHolderText);

      fireEvent.changeText(input, newTag.tag.toUpperCase()); // matches many
      fireEvent(input, 'submitEditing', { nativeEvent: { text: newTag.tag.toUpperCase() } });

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(newTag.tag);
      expect(tags[1]).toHaveTextContent(selectedTag.tag);
      expect(tags[2]).toHaveTextContent(firstTag.tag);
      expect(tags[3]).toHaveTextContent(middleTag.tag);
      expect(tags[4]).toHaveTextContent(lastTag.tag);

      expect(screen.getByPlaceholderText(placeHolderText).props.value).toBe('');
    });

    it('on enter, add new tag to list and selects it', () => {
      const input = screen.getByPlaceholderText(placeHolderText);

      fireEvent.changeText(input, newTag.tag);
      fireEvent(input, 'submitEditing', { nativeEvent: { text: newTag.tag } });

      const tags = screen.queryAllByText(tagsPattern);

      expect(tags[0]).toHaveTextContent(newTag.tag);
      expect(tags[1]).toHaveTextContent(selectedTag.tag);
      expect(tags[2]).toHaveTextContent(firstTag.tag);
      expect(tags[3]).toHaveTextContent(middleTag.tag);
      expect(tags[4]).toHaveTextContent(lastTag.tag);
    });
  });
});
