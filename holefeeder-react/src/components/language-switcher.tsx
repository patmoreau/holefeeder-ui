import React, { useState } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { useStyles } from '@/hooks/theme/use-styles';
import { useLanguage } from '@/hooks/use-language';
import { getColor, getThemedTypography } from '@/utils/style-utils';

type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'all-scroll'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'zoom-in'
  | 'zoom-out';

type WebStyle = ViewStyle & {
  cursor?: CursorType;
  userSelect?: 'none';
  transition?: string;
  ':hover'?: ViewStyle & { opacity?: number };
  boxShadow?: string;
};

export function LanguageSwitcher() {
  const { setUserLanguage, availableLanguages, currentLanguage } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(availableLanguages.findIndex((lang) => lang.code === currentLanguage));

  const styles = useStyles((theme) => ({
    container: {
      flexDirection: 'row' as const,
      backgroundColor: getColor(theme, 'secondarySystemBackground'),
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
            transition: 'background-color 0.2s ease',
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

  const handleLanguageChange = async (languageCode: 'en' | 'fr', index: number) => {
    await setUserLanguage(languageCode);
    setSelectedIndex(index);
  };

  return (
    <View style={styles.container as ViewStyle}>
      {availableLanguages.map((language, index) => (
        <Pressable
          key={language.code}
          style={[styles.button as ViewStyle, index === selectedIndex && (styles.selectedButton as ViewStyle)]}
          onPress={() => handleLanguageChange(language.code, index)}
          role="radio"
          aria-checked={index === selectedIndex}
        >
          <Text style={[styles.buttonText, index === selectedIndex && styles.selectedButtonText]}>{language.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}
