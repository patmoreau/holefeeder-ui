import { Picker } from '@expo/ui/swift-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { ThemeMode } from '@/types/theme/theme';

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { changeThemeMode, availableThemeModes, themeMode } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  const handleLanguageChange = (theme: ThemeMode) => changeThemeMode(theme);

  useEffect(() => {
    setSelectedIndex(availableThemeModes.findIndex((mode) => mode.code === themeMode));
  }, [themeMode, availableThemeModes]);

  return (
    <Picker
      modifiers={[]}
      options={availableThemeModes.map((mode) => t(`${tk.themeSwitcher}.${mode.langId}`))}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableThemeModes[index].code).finally(() => setSelectedIndex(index));
      }}
      variant="menu"
    />
  );
}
