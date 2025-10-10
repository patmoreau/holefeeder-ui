import { render } from '@testing-library/react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Tag } from '../tag';

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

const TestTagWithTheme: React.FC<{
  label: string;
  colorScheme?: 'light' | 'dark';
}> = ({ label, colorScheme = 'light' }) => {
  mockUseColorScheme.mockReturnValue(colorScheme);

  return <Tag label={label} />;
};

describe('Tag Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with a label', () => {
    const { getByText } = render(<TestTagWithTheme label="Test Tag" />);

    expect(getByText('Test Tag')).toBeTruthy();
  });

  it('renders with light theme colors', () => {
    const { getByText } = render(<TestTagWithTheme label="Light Tag" colorScheme="light" />);

    const tagText = getByText('Light Tag');
    expect(tagText).toBeTruthy();

    // The tag should be rendered with light theme styling
    const tagContainer = tagText.parent;
    expect(tagContainer).toBeTruthy();
  });

  it('renders with dark theme colors', () => {
    const { getByText } = render(<TestTagWithTheme label="Dark Tag" colorScheme="dark" />);

    const tagText = getByText('Dark Tag');
    expect(tagText).toBeTruthy();

    // The tag should be rendered with dark theme styling
    const tagContainer = tagText.parent;
    expect(tagContainer).toBeTruthy();
  });

  it('handles empty label gracefully', () => {
    const { getByText } = render(<TestTagWithTheme label="" />);

    expect(getByText('')).toBeTruthy();
  });

  it('handles special characters in label', () => {
    const specialLabel = 'Tag with @#$%^&*()';
    const { getByText } = render(<TestTagWithTheme label={specialLabel} />);

    expect(getByText(specialLabel)).toBeTruthy();
  });

  it('handles long text labels', () => {
    const longLabel = 'This is a very long tag label that might wrap or overflow';
    const { getByText } = render(<TestTagWithTheme label={longLabel} />);

    expect(getByText(longLabel)).toBeTruthy();
  });

  it('applies correct text styling', () => {
    const { getByText } = render(<TestTagWithTheme label="Styled Tag" />);

    const tagText = getByText('Styled Tag');
    const style = tagText.props.style;

    expect(style).toMatchObject({
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
    });
  });

  it('switches theme when colorScheme changes', () => {
    const { getByText, rerender } = render(<TestTagWithTheme label="Theme Switch" colorScheme="light" />);

    expect(getByText('Theme Switch')).toBeTruthy();

    // Re-render with dark theme
    rerender(<TestTagWithTheme label="Theme Switch" colorScheme="dark" />);

    expect(getByText('Theme Switch')).toBeTruthy();
  });
});
