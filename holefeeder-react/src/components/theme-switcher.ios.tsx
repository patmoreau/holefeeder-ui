import { Picker } from '@expo/ui/swift-ui';
import React, { useEffect, useState } from 'react';
import { useLanguage, useTheme } from '@/hooks';
import { ThemeMode } from '@/types/theme/theme';

export function ThemeSwitcher() {
  const { t } = useLanguage();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  const handleLanguageChange = (theme: ThemeMode) => changeThemeMode(theme);

  useEffect(() => {
    setSelectedIndex(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  }, [themeMode, availableThemeModes]);

  return (
    <Picker
      modifiers={[]}
      options={availableThemeModes.map((mode) => t(`theme-switcher.${mode.langId}`))}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableThemeModes[index].code).finally(() => setSelectedIndex(index));
      }}
      variant="menu"
    />
  );
}
