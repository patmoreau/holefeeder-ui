import {
  createStyles,
  getSpacing,
  getColor,
  combineStyles,
  getThemeStyle,
  getButtonStyle,
  getContainerStyle,
  getTextStyle,
  getLayoutStyle,
} from '@/utils';
import { Theme } from '@/types/theme';

// Mock theme for testing - matching your actual Theme interface
const mockTheme: Theme = {
  colors: {
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D92',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',

    // UI Element Colors
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#34C759',
    quaternary: '#FF9500',

    // Status/State Colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',

    // Label Colors
    label: '#000000',
    secondaryLabel: '#3C3C43',
    tertiaryLabel: '#3C3C43',
    quaternaryLabel: '#3C3C43',

    // Fill Colors
    systemFill: '#78788033',
    secondarySystemFill: '#78788028',
    tertiarySystemFill: '#7676801F',
    quaternarySystemFill: '#74748014',

    // Background Colors
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',

    // Grouped Background Colors
    systemGroupedBackground: '#F2F2F7',
    secondarySystemGroupedBackground: '#FFFFFF',
    tertiarySystemGroupedBackground: '#F2F2F7',

    // Separator Colors
    separator: '#3C3C4349',
    opaqueSeparator: '#C6C6C8',

    // Other
    link: '#007AFF',
    placeholderText: '#3C3C4399',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },

  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 44,
  },

  typography: {
    largeTitle: {
      fontSize: 34,
      fontWeight: '700',
      lineHeight: 41,
      letterSpacing: 0.37,
    },
    title1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    title2: {
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
      letterSpacing: 0.38,
    },
    headline: {
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    body: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    callout: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 21,
      letterSpacing: -0.32,
    },
    subheadline: {
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    caption1: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 13,
      letterSpacing: 0.07,
    },
  },

  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
  },

  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },

  layout: {
    navBarHeight: 44,
    tabBarHeight: 49,
    statusBarHeight: 20,
    safeAreaInsetBottom: 34,
  },

  components: {
    button: {
      minHeight: 44,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    input: {
      height: 44,
      borderWidth: 1,
      paddingHorizontal: 16,
    },
    card: {
      padding: 16,
      borderRadius: 10,
    },
    modal: {
      borderRadius: 14,
      padding: 20,
    },
  },

  styles: {
    buttons: {
      primary: {
        backgroundColor: '#007AFF',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      danger: {
        backgroundColor: '#FF3B30',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      ghost: {
        backgroundColor: 'transparent',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    containers: {
      page: {
        flex: 1,
        padding: 16,
      },
      card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      section: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      center: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    text: {
      error: {
        color: '#FF3B30',
        fontSize: 14,
      },
      success: {
        color: '#34C759',
        fontSize: 14,
      },
      muted: {
        color: '#3C3C43',
        fontSize: 14,
        opacity: 0.6,
      },
      link: {
        color: '#007AFF',
        fontSize: 14,
        textDecorationLine: 'underline',
      },
    },
    layouts: {
      flexRowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      flexColumnCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
};

describe('Theme Style Utilities', () => {
  describe('createStyles', () => {
    it('should return the result of the styles function', () => {
      // Arrange
      const stylesFn = jest.fn((theme: Theme) => ({
        container: {
          backgroundColor: theme.colors.systemBackground,
          padding: theme.spacing.md,
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
          padding: theme.spacing.lg,
        },
        text: {
          fontSize: theme.typography.body.fontSize,
          color: theme.colors.placeholderText,
        },
      }));

      // Act
      const result = styles(mockTheme);

      // Assert
      expect(result.container.backgroundColor).toBe(mockTheme.colors.primary);
      expect(result.container.padding).toBe(mockTheme.spacing.lg);
      expect(result.text.fontSize).toBe(mockTheme.typography.body.fontSize);
      expect(result.text.color).toBe(mockTheme.colors.placeholderText);
    });
  });

  describe('getSpacing', () => {
    it('should return correct spacing value', () => {
      // Arrange
      const spacingKeys = ['xs', 'md', 'xl', 'xxl', 'xxxl'] as const;
      const expectedValues = [4, 16, 24, 32, 44];

      // Act & Assert
      spacingKeys.forEach((key, index) => {
        const result = getSpacing(mockTheme, key);
        expect(result).toBe(expectedValues[index]);
      });
    });
  });

  describe('getColor', () => {
    it('should return correct color value', () => {
      // Arrange
      const colorTests = [
        { key: 'primary', expected: '#007AFF' },
        { key: 'systemBackground', expected: '#FFFFFF' },
        { key: 'error', expected: '#FF3B30' },
        { key: 'systemGreen', expected: '#34C759' },
        { key: 'placeholderText', expected: '#3C3C4399' },
      ] as const;

      // Act & Assert
      colorTests.forEach(({ key, expected }) => {
        const result = getColor(mockTheme, key);
        expect(result).toBe(expected);
      });
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

  describe('getThemeStyle', () => {
    it('should return correct style from theme', () => {
      // Arrange
      const styleCategory = 'buttons';
      const variant = 'primary';
      const expectedStyle = mockTheme.styles.buttons.primary;

      // Act
      const result = getThemeStyle(mockTheme, styleCategory, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return empty object for non-existent variant', () => {
      // Arrange
      const styleCategory = 'buttons';
      const nonExistentVariant = 'nonexistent';

      // Act
      const result = getThemeStyle(
        mockTheme,
        styleCategory,
        nonExistentVariant
      );

      // Assert
      expect(result).toEqual({});
    });
  });

  describe('getButtonStyle', () => {
    it('should return correct button style', () => {
      // Arrange
      const variant = 'primary';
      const expectedStyle = mockTheme.styles.buttons.primary;

      // Act
      const result = getButtonStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return secondary button style', () => {
      // Arrange
      const variant = 'secondary';
      const expectedStyle = mockTheme.styles.buttons.secondary;

      // Act
      const result = getButtonStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return danger button style', () => {
      // Arrange
      const variant = 'danger';
      const expectedStyle = mockTheme.styles.buttons.danger;

      // Act
      const result = getButtonStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return ghost button style', () => {
      // Arrange
      const variant = 'ghost';
      const expectedStyle = mockTheme.styles.buttons.ghost;

      // Act
      const result = getButtonStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });
  });

  describe('getContainerStyle', () => {
    it('should return correct container style', () => {
      // Arrange
      const variant = 'card';
      const expectedStyle = mockTheme.styles.containers.card;

      // Act
      const result = getContainerStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return page container style', () => {
      // Arrange
      const variant = 'page';
      const expectedStyle = mockTheme.styles.containers.page;

      // Act
      const result = getContainerStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return section container style', () => {
      // Arrange
      const variant = 'section';
      const expectedStyle = mockTheme.styles.containers.section;

      // Act
      const result = getContainerStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });
  });

  describe('getTextStyle', () => {
    it('should return correct text style', () => {
      // Arrange
      const variant = 'error';
      const expectedStyle = mockTheme.styles.text.error;

      // Act
      const result = getTextStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return success text style', () => {
      // Arrange
      const variant = 'success';
      const expectedStyle = mockTheme.styles.text.success;

      // Act
      const result = getTextStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return muted text style', () => {
      // Arrange
      const variant = 'muted';
      const expectedStyle = mockTheme.styles.text.muted;

      // Act
      const result = getTextStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return link text style', () => {
      // Arrange
      const variant = 'link';
      const expectedStyle = mockTheme.styles.text.link;

      // Act
      const result = getTextStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });
  });

  describe('getLayoutStyle', () => {
    it('should return correct layout style', () => {
      // Arrange
      const variant = 'flexRowBetween';
      const expectedStyle = mockTheme.styles.layouts.flexRowBetween;

      // Act
      const result = getLayoutStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return flexRowCenter layout style', () => {
      // Arrange
      const variant = 'flexRowCenter';
      const expectedStyle = mockTheme.styles.layouts.flexRowCenter;

      // Act
      const result = getLayoutStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });

    it('should return flexColumnCenter layout style', () => {
      // Arrange
      const variant = 'flexColumnCenter';
      const expectedStyle = mockTheme.styles.layouts.flexColumnCenter;

      // Act
      const result = getLayoutStyle(mockTheme, variant);

      // Assert
      expect(result).toEqual(expectedStyle);
    });
  });

  describe('Integration tests', () => {
    it('should work together in a real-world scenario', () => {
      // Arrange
      const styles = createStyles((theme: Theme) => ({
        button: combineStyles(getButtonStyle(theme, 'primary'), {
          margin: getSpacing(theme, 'sm'),
        }),
        container: {
          ...getContainerStyle(theme, 'card'),
          backgroundColor: getColor(theme, 'systemBackground'),
        },
        text: getTextStyle(theme, 'error'),
      }));
      const expectedButtonStyle = {
        ...mockTheme.styles.buttons.primary,
        margin: 8,
      };
      const expectedBackgroundColor = '#FFFFFF';
      const expectedTextStyle = mockTheme.styles.text.error;

      // Act
      const result = styles(mockTheme);

      // Assert
      expect(result.button).toEqual(expectedButtonStyle);
      expect(result.container.backgroundColor).toBe(expectedBackgroundColor);
      expect(result.text).toEqual(expectedTextStyle);
    });
  });
});

// Additional test for edge cases
describe('Edge Cases', () => {
  it('should handle missing theme properties gracefully', () => {
    // Arrange
    const incompleteTheme = {
      spacing: { sm: 8 },
      colors: { primary: '#000' },
      styles: { buttons: {} },
    } as any;

    // Act & Assert
    expect(() => getSpacing(incompleteTheme, 'md' as any)).not.toThrow();
    expect(() => getColor(incompleteTheme, 'secondary' as any)).not.toThrow();
    expect(() =>
      getButtonStyle(incompleteTheme, 'primary' as any)
    ).not.toThrow();
  });
});
