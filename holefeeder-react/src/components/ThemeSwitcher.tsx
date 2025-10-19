import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';
import { useTextStyles } from '@/hooks/theme/use-styles';
import { useTheme } from '@/hooks/theme/use-theme';
import { useLanguage } from '@/hooks/use-language';
import { ThemeMode } from '@/types/theme/theme';

export function ThemeSwitcher() {
  const { t } = useLanguage();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const textStyles = useTextStyles();

  const handleThemeChange = async (theme: ThemeMode, index: number) => {
    await changeThemeMode(theme);
  };

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker
        style={textStyles.picker}
        selectedValue={themeMode}
        onValueChange={(code: ThemeMode, index: number) => handleThemeChange(code, index).then()}
      >
        {availableThemeModes.map((mode) => (
          <Picker.Item key={mode.code} label={t(`theme-switcher.${mode.langId}`)} value={mode} style={textStyles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
