import { ViewStyle, TextStyle, Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: {
    // System Colors
    systemBlue: string;
    systemGreen: string;
    systemIndigo: string;
    systemOrange: string;
    systemPink: string;
    systemPurple: string;
    systemRed: string;
    systemTeal: string;
    systemYellow: string;

    // UI Element Colors
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;

    // Status/State Colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Label Colors
    label: string;
    secondaryLabel: string;
    tertiaryLabel: string;
    quaternaryLabel: string;

    // Fill Colors
    systemFill: string;
    secondarySystemFill: string;
    tertiarySystemFill: string;
    quaternarySystemFill: string;

    // Background Colors
    systemBackground: string;
    secondarySystemBackground: string;
    tertiarySystemBackground: string;

    // Grouped Background Colors
    systemGroupedBackground: string;
    secondarySystemGroupedBackground: string;
    tertiarySystemGroupedBackground: string;

    // Separator Colors
    separator: string;
    opaqueSeparator: string;

    // Other
    link: string;
    placeholderText: string;
    systemGray: string;
    systemGray2: string;
    systemGray3: string;
    systemGray4: string;
    systemGray5: string;
    systemGray6: string;
  };

  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  spacing: {
    xs: number; // 4
    sm: number; // 8
    md: number; // 16
    lg: number; // 20
    xl: number; // 24
    xxl: number; // 32
    xxxl: number; // 44
  };

  typography: {
    // iOS Text Styles
    largeTitle: TextStyle; // 34pt
    title1: TextStyle; // 28pt
    title2: TextStyle; // 22pt
    title3: TextStyle; // 20pt
    headline: TextStyle; // 17pt semibold
    body: TextStyle; // 17pt
    callout: TextStyle; // 16pt
    subheadline: TextStyle; // 15pt
    footnote: TextStyle; // 13pt
    caption1: TextStyle; // 12pt
    caption2: TextStyle; // 11pt
  };

  borderRadius: {
    sm: number; // 6
    md: number; // 10
    lg: number; // 14
    xl: number; // 20
  };

  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };

  layout: {
    navBarHeight: number;
    tabBarHeight: number;
    statusBarHeight: number;
    safeAreaInsetBottom: number;
  };

  components: {
    button: {
      minHeight: number;
      paddingHorizontal: number;
      paddingVertical: number;
    };
    input: {
      height: number;
      borderWidth: number;
      paddingHorizontal: number;
    };
    card: {
      padding: number;
      borderRadius: number;
    };
    modal: {
      borderRadius: number;
      padding: number;
    };
  };

  styles: {
    // Button variants
    buttons: {
      primary: ViewStyle;
      secondary: ViewStyle;
      danger: ViewStyle;
      ghost: ViewStyle;
    };

    // Container styles
    containers: {
      page: ViewStyle;
      card: ViewStyle;
      section: ViewStyle;
      row: ViewStyle;
      center: ViewStyle;
    };

    // Text variants
    text: {
      error: TextStyle;
      success: TextStyle;
      muted: TextStyle;
      link: TextStyle;
    };

    // Common layouts
    layouts: {
      flexRowBetween: ViewStyle;
      flexRowCenter: ViewStyle;
      flexColumnCenter: ViewStyle;
    };
  };
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// theme/lightTheme.ts
export const lightTheme: Theme = {
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
    secondaryLabel: '#3C3C43', // 60% opacity
    tertiaryLabel: '#3C3C43', // 30% opacity
    quaternaryLabel: '#3C3C43', // 18% opacity

    // Fill Colors
    systemFill: '#78788033', // 20% opacity
    secondarySystemFill: '#78788028', // 16% opacity
    tertiarySystemFill: '#7676801F', // 12% opacity
    quaternarySystemFill: '#74748014', // 8% opacity

    // Background Colors
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',

    // Grouped Background Colors
    systemGroupedBackground: '#F2F2F7',
    secondarySystemGroupedBackground: '#FFFFFF',
    tertiarySystemGroupedBackground: '#F2F2F7',

    // Separator Colors
    separator: '#3C3C4349', // 22% opacity
    opaqueSeparator: '#C6C6C8',

    // Other
    link: '#007AFF',
    placeholderText: '#3C3C4399', // 60% opacity
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
