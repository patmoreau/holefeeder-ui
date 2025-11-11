import { Picker } from '@expo/ui/swift-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tk } from '@/i18n/translations';
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
  const [selectedIndex, setSelectedIndex] = useState(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  const handleLanguageChange = (theme: ThemeMode) => changeThemeMode(theme);

  useEffect(() => {
    setSelectedIndex(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  }, [themeMode, availableThemeModes]);

  return (
    <Picker
      options={availableThemeModes.map((mode) => t(tkThemes[mode.code]))}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableThemeModes[index].code).finally(() => setSelectedIndex(index));
      }}
      variant="menu"
    />
  );
};
