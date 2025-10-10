import { renderHook } from '@testing-library/react-native';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

// Mock the useColorScheme hook
jest.mock('@/hooks/use-color-scheme');
const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

// Mock Colors constant
jest.mock('@/constants/colors', () => ({
  Colors: {
    light: {
      text: '#000000',
      background: '#ffffff',
    },
    dark: {
      text: '#ffffff',
      background: '#000000',
    },
  },
}));

describe('useThemeColor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return color from props when provided for light theme', () => {
    // Arrange
    mockUseColorScheme.mockReturnValue('light');
    const props = { light: '#ff0000', dark: '#00ff00' };
    const colorName = 'text' as keyof typeof Colors.light;

    // Act
    const { result } = renderHook(() => useThemeColor(props, colorName));

    // Assert
    expect(result.current).toBe('#ff0000');
  });

  it('should return color from props when provided for dark theme', () => {
    // Arrange
    mockUseColorScheme.mockReturnValue('dark');
    const props = { light: '#ff0000', dark: '#00ff00' };
    const colorName = 'text' as keyof typeof Colors.light;

    // Act
    const { result } = renderHook(() => useThemeColor(props, colorName));

    // Assert
    expect(result.current).toBe('#00ff00');
  });

  it('should return color from Colors constant when props not provided for light theme', () => {
    // Arrange
    mockUseColorScheme.mockReturnValue('light');
    const props = {};
    const colorName = 'text' as keyof typeof Colors.light;

    // Act
    const { result } = renderHook(() => useThemeColor(props, colorName));

    // Assert
    expect(result.current).toBe('#000000');
  });

  it('should return color from Colors constant when props not provided for dark theme', () => {
    // Arrange
    mockUseColorScheme.mockReturnValue('dark');
    const props = {};
    const colorName = 'background' as keyof typeof Colors.light;

    // Act
    const { result } = renderHook(() => useThemeColor(props, colorName));

    // Assert
    expect(result.current).toBe('#000000');
  });

  it('should default to light theme when useColorScheme returns null', () => {
    // Arrange
    mockUseColorScheme.mockReturnValue(null);
    const props = {};
    const colorName = 'text' as keyof typeof Colors.light;

    // Act
    const { result } = renderHook(() => useThemeColor(props, colorName));

    // Assert
    expect(result.current).toBe('#000000');
  });
});
