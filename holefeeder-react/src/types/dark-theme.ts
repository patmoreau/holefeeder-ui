import { lightTheme, Theme } from '@/types/theme';

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    // System Colors (slightly adjusted for dark mode)
    systemBlue: '#0A84FF',
    systemGreen: '#30D158',
    systemIndigo: '#5E5CE6',
    systemOrange: '#FF9F0A',
    systemPink: '#FF375F',
    systemPurple: '#BF5AF2',
    systemRed: '#FF453A',
    systemTeal: '#64D2FF',
    systemYellow: '#FFD60A',

    // UI Element Colors
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    tertiary: '#30D158',
    quaternary: '#FF9F0A',

    // Status/State Colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',

    // Label Colors
    label: '#FFFFFF',
    secondaryLabel: '#EBEBF5', // 60% opacity
    tertiaryLabel: '#EBEBF5', // 30% opacity
    quaternaryLabel: '#EBEBF5', // 18% opacity

    // Fill Colors
    systemFill: '#7676801F', // 12% opacity
    secondarySystemFill: '#78788028', // 10% opacity
    tertiarySystemFill: '#7676801A', // 8% opacity
    quaternarySystemFill: '#74748014', // 6% opacity

    // Background Colors
    systemBackground: '#000000',
    secondarySystemBackground: '#1C1C1E',
    tertiarySystemBackground: '#2C2C2E',

    // Grouped Background Colors
    systemGroupedBackground: '#000000',
    secondarySystemGroupedBackground: '#1C1C1E',
    tertiarySystemGroupedBackground: '#2C2C2E',

    // Separator Colors
    separator: '#54545899', // 33% opacity
    opaqueSeparator: '#38383A',

    // Other
    link: '#0A84FF',
    placeholderText: '#EBEBF599', // 60% opacity
    systemGray: '#8E8E93',
    systemGray2: '#636366',
    systemGray3: '#48484A',
    systemGray4: '#3A3A3C',
    systemGray5: '#2C2C2E',
    systemGray6: '#1C1C1E',
  },

  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.48,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 4.65,
      elevation: 8,
    },
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
        backgroundColor: '#0A84FF',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.48,
        shadowRadius: 1.0,
        elevation: 1,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0A84FF',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      danger: {
        backgroundColor: '#FF453A',
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.48,
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
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.48,
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
        color: '#FF453A',
        fontSize: 14,
      },
      success: {
        color: '#30D158',
        fontSize: 14,
      },
      muted: {
        color: '#EBEBF5',
        fontSize: 14,
        opacity: 0.6,
      },
      link: {
        color: '#0A84FF',
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
