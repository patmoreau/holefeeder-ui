import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { tk } from '@/i18n/translations';
import { useTextStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { ThemeMode } from '@/types/theme/theme';

const tkThemes: Record<ThemeMode, string> = {
  [ThemeMode.light]: tk.themeSwitcher.light,
  [ThemeMode.dark]: tk.themeSwitcher.dark,
  [ThemeMode.system]: tk.themeSwitcher.system,
};

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const textStyles = useTextStyles();

  const handleThemeChange = async (theme: ThemeMode) => {
    await changeThemeMode(theme);
  };

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker style={textStyles.picker} selectedValue={themeMode} onValueChange={(code: ThemeMode) => handleThemeChange(code).then()}>
        {availableThemeModes.map((mode) => (
          <Picker.Item key={mode.code} label={t(tkThemes[mode.code])} value={mode} style={textStyles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
};
