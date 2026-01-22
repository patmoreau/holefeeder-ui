import { renderHook } from '@testing-library/react-native';
import { aDarkThemeState, aLightThemeState } from '@/__tests__/mocks/theme-state-builder';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useThemeColor } from '@/shared/hooks/theme/use-theme-color';
import { darkTheme } from '@/types/theme/dark';
import { lightTheme } from '@/types/theme/light';

jest.mock('@/shared/hooks/theme/use-theme');
const mockUseTheme = jest.mocked(useTheme);

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when using color from props', () => {
    it('should return color provided for light theme', () => {
      mockUseTheme.mockReturnValue(aLightThemeState());
      const props = { light: '#ff0000', dark: '#00ff00' };
      const colorName = 'text';

      const { result } = renderHook(() => useThemeColor(props, colorName));

      expect(result.current).toBe('#ff0000');
    });

    it('should return color provided for dark theme', () => {
      mockUseTheme.mockReturnValue(aDarkThemeState());
      const props = { light: '#ff0000', dark: '#00ff00' };
      const colorName = 'text';

      const { result } = renderHook(() => useThemeColor(props, colorName));

      expect(result.current).toBe('#00ff00');
    });

    it('should return color from light theme when props not provided for light theme', () => {
      mockUseTheme.mockReturnValue(aLightThemeState());
      const props = { dark: '#00ff00' };
      const colorName = 'text';

      // Act
      const { result } = renderHook(() => useThemeColor(props, colorName));

      // Assert
      expect(result.current).toBe(lightTheme.colors.text);
    });

    it('should return color from dark theme when props not provided for dark theme', () => {
      mockUseTheme.mockReturnValue(aDarkThemeState());
      const props = { light: '#ff0000' };
      const colorName = 'text';

      const { result } = renderHook(() => useThemeColor(props, colorName));

      expect(result.current).toBe(darkTheme.colors.text);
    });
  });

  describe('when using color from theme', () => {
    it('should return color from light theme when no light props', () => {
      mockUseTheme.mockReturnValue(aLightThemeState());
      const props = {};
      const colorName = 'text';

      const { result } = renderHook(() => useThemeColor(props, colorName));

      expect(result.current).toBe(lightTheme.colors.text);
    });

    it('should return color from Colors constant when props not provided for dark theme', () => {
      mockUseTheme.mockReturnValue(aDarkThemeState());
      const props = {};
      const colorName = 'text';

      const { result } = renderHook(() => useThemeColor(props, colorName));

      expect(result.current).toBe(darkTheme.colors.text);
    });
  });
});
