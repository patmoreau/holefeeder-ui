import React, { useState } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useLanguage, useTheme, useStyles } from '@/hooks';
import { ThemeMode } from '@/types';
import { getColor, getThemedTypography } from '@/utils/style-utils';

type CursorType = 'default' | 'pointer';

type WebStyle = ViewStyle & {
  cursor?: CursorType;
  userSelect?: 'none';
  transition?: string;
  ':hover'?: ViewStyle & { opacity?: number };
  boxShadow?: string;
};

export function ThemeSwitcher() {
  const { t } = useLanguage();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(availableThemeModes.findIndex((mode) => mode.code === themeMode));

  const styles = useStyles((theme) => ({
    container: {
      flexDirection: 'row' as const,
      backgroundColor: getColor(theme, 'secondaryBackground'),
      borderRadius: 8,
      padding: 2,
      ...(Platform.OS === 'web'
        ? ({
            cursor: 'default' as CursorType,
            userSelect: 'none',
          } as WebStyle)
        : {}),
    },
    button: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...(Platform.OS === 'web'
        ? ({
            cursor: 'pointer' as CursorType,
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: getColor(theme, 'systemBackground'),
              opacity: 0.8,
            },
          } as WebStyle)
        : {}),
    },
    selectedButton: {
      backgroundColor: getColor(theme, 'systemBackground'),
      ...(Platform.OS === 'web'
        ? ({
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          } as WebStyle)
        : {}),
    },
    buttonText: {
      ...getThemedTypography(theme, 'subheadline', 'secondaryLabel'),
    },
    selectedButtonText: {
      ...getThemedTypography(theme, 'subheadline', 'label'),
    },
  }));

  const handleThemeChange = async (theme: ThemeMode, index: number) => {
    await changeThemeMode(theme);
    setSelectedIndex(index);
  };

  return (
    <View style={styles.container as ViewStyle}>
      {availableThemeModes.map((mode, index) => (
        <Pressable
          key={mode.code}
          style={[styles.button as ViewStyle, index === selectedIndex && (styles.selectedButton as ViewStyle)]}
          onPress={() => handleThemeChange(mode.code, index)}
          role="radio"
          aria-checked={index === selectedIndex}
        >
          <Text style={[styles.buttonText, index === selectedIndex && styles.selectedButtonText]}>{t(`theme-switcher.${mode.langId}`)}</Text>
        </Pressable>
      ))}
    </View>
  );
}
