import { lightTheme, Theme } from '@/types/theme';
import { createStyles, getColor, combineStyles, getContainerStyle } from '@/utils/style-utils';

const mockTheme = lightTheme;

describe('Theme Style Utilities', () => {
  describe('createStyles', () => {
    it('should return the result of the styles function', () => {
      // Arrange
      const stylesFn = jest.fn((theme: Theme) => ({
        container: {
          backgroundColor: theme.colors.background,
          padding: 16,
        },
      }));

      // Act
      const result = createStyles(stylesFn);

      // Assert
      expect(result).toBe(stylesFn);
    });

    it('should preserve type information', () => {
      // Arrange
      const styles = createStyles((theme: Theme) => ({
        container: {
          backgroundColor: theme.colors.primary,
        },
        text: {
          fontSize: theme.typography.body.fontSize,
          color: theme.colors.text,
        },
      }));

      // Act
      const result = styles(mockTheme);

      // Assert
      expect(result.container.backgroundColor).toBe(mockTheme.colors.primary);
      expect(result.text.fontSize).toBe(mockTheme.typography.body.fontSize);
      expect(result.text.color).toBe(mockTheme.colors.text);
    });
  });

  describe('getColor', () => {
    const colorTests = [
      { key: 'text', expected: '#000000' },
      { key: 'background', expected: '#FFFFFF' },
      { key: 'primary', expected: '#007AFF' },
      { key: 'secondary', expected: '#FF5733' },
    ] as const;

    it.each(colorTests)('should return correct color value', ({ key, expected }) => {
      const result = getColor(mockTheme, key);
      expect(result).toBe(expected);
    });
  });

  describe('combineStyles', () => {
    it('should merge theme style with custom style', () => {
      // Arrange
      const themeStyle = {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
      };
      const customStyle = {
        padding: 20,
        margin: 10,
      };
      const expectedResult = {
        backgroundColor: '#FFFFFF',
        padding: 20, // overridden
        borderRadius: 8,
        margin: 10, // added
      };

      // Act
      const result = combineStyles(themeStyle, customStyle);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should work with undefined custom style', () => {
      // Arrange
      const themeStyle = {
        backgroundColor: '#FFFFFF',
        padding: 16,
      };

      // Act
      const result = combineStyles(themeStyle, undefined);

      // Assert
      expect(result).toEqual(themeStyle);
    });

    it('should work with empty custom style', () => {
      // Arrange
      const themeStyle = {
        backgroundColor: '#FFFFFF',
        padding: 16,
      };

      // Act
      const result = combineStyles(themeStyle, {});

      // Assert
      expect(result).toEqual(themeStyle);
    });
  });

  describe('getContainerStyle', () => {
    it('should return page container style', () => {
      const variant = 'page';
      const expectedStyle = mockTheme.styles.containers.page;

      const result = getContainerStyle(mockTheme, variant);

      expect(result).toEqual(expectedStyle);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing theme properties gracefully', () => {
      // Arrange
      const incompleteTheme = {
        colors: { primary: '#000' },
        styles: { containers: {} },
      } as any;

      // Act & Assert
      expect(() => getColor(incompleteTheme, 'secondary' as any)).not.toThrow();
      expect(() => getContainerStyle(incompleteTheme, 'secondary' as any)).not.toThrow();
    });
  });
});
