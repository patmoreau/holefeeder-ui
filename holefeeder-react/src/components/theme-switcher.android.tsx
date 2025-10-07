import { Picker } from '@expo/ui/jetpack-compose';
import React, { useState } from 'react';
import { ThemeMode } from '@/types';
import { useLanguage, useTheme } from '@/hooks';

export function ThemeSwitcher() {
  const { t } = useLanguage();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(
    availableThemeModes.findIndex((mode) => mode.code === themeMode)
  );

  const handleLanguageChange = (theme: ThemeMode) => changeThemeMode(theme);

  return (
    <Picker
      options={availableThemeModes.map((mode) =>
        t(`theme-switcher.${mode.langId}`)
      )}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableThemeModes[index].code).finally(() =>
          setSelectedIndex(index)
        );
      }}
      variant="segmented"
    />
  );
}
