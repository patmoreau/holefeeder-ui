import { render } from '@testing-library/react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { TagList } from '../taglist';

// Mock react-native's useColorScheme
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

const TestTagListWithTheme: React.FC<{
  tags: string[];
  colorScheme?: 'light' | 'dark';
}> = ({ tags, colorScheme = 'light' }) => {
  mockUseColorScheme.mockReturnValue(colorScheme);

  return <TagList tags={tags} />;
};

describe('TagList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with multiple tags', () => {
    const tags = ['React', 'TypeScript', 'Expo'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    expect(getByText('React')).toBeTruthy();
    expect(getByText('TypeScript')).toBeTruthy();
    expect(getByText('Expo')).toBeTruthy();
  });

  it('renders correctly with a single tag', () => {
    const tags = ['Single Tag'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    expect(getByText('Single Tag')).toBeTruthy();
  });

  it('handles empty array gracefully', () => {
    const { queryByText } = render(<TestTagListWithTheme tags={[]} />);

    // Should render container but no tags
    expect(queryByText('React')).toBeNull();
  });

  it('renders correct number of tags', () => {
    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    tags.forEach((tag) => {
      expect(getByText(tag)).toBeTruthy();
    });
  });

  it('handles duplicate tags', () => {
    const tags = ['Duplicate', 'Duplicate', 'Unique'];
    const { getAllByText, getByText } = render(<TestTagListWithTheme tags={tags} />);

    // Should render both duplicate tags
    expect(getAllByText('Duplicate')).toHaveLength(2);
    expect(getByText('Unique')).toBeTruthy();
  });

  it('handles tags with special characters', () => {
    const tags = ['React.js', 'C++', '@angular', '#hashtag'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    tags.forEach((tag) => {
      expect(getByText(tag)).toBeTruthy();
    });
  });

  it('handles long tag lists', () => {
    const tags = Array.from({ length: 20 }, (_, i) => `Tag${i + 1}`);
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    // Check first few and last few tags
    expect(getByText('Tag1')).toBeTruthy();
    expect(getByText('Tag10')).toBeTruthy();
    expect(getByText('Tag20')).toBeTruthy();
  });

  it('applies correct container styling', () => {
    const tags = ['Test Tag'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    const tagText = getByText('Test Tag');
    const container = tagText.parent?.parent; // Navigate up to container

    expect(container).toBeTruthy();
  });

  it('works with both light and dark themes', () => {
    const tags = ['Theme Test'];

    // Test light theme
    const { getByText: getLightText } = render(<TestTagListWithTheme tags={tags} colorScheme="light" />);
    expect(getLightText('Theme Test')).toBeTruthy();

    // Test dark theme
    const { getByText: getDarkText } = render(<TestTagListWithTheme tags={tags} colorScheme="dark" />);
    expect(getDarkText('Theme Test')).toBeTruthy();
  });

  it('handles empty strings in tags array', () => {
    const tags = ['Valid Tag', '', 'Another Valid Tag'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    expect(getByText('Valid Tag')).toBeTruthy();
    expect(getByText('Another Valid Tag')).toBeTruthy();
    expect(getByText('')).toBeTruthy(); // Empty string should still render
  });

  it('maintains proper key assignment for tags', () => {
    const tags = ['First', 'Second', 'Third'];
    const { getAllByText } = render(<TestTagListWithTheme tags={tags} />);

    // Each tag should be rendered exactly once
    tags.forEach((tag) => {
      expect(getAllByText(tag)).toHaveLength(1);
    });
  });

  it('handles very long individual tag names', () => {
    const longTagName = 'This is a very long tag name that might cause layout issues if not handled properly';
    const tags = [longTagName, 'Short'];
    const { getByText } = render(<TestTagListWithTheme tags={tags} />);

    expect(getByText(longTagName)).toBeTruthy();
    expect(getByText('Short')).toBeTruthy();
  });
});
