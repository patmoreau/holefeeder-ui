import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { Picker, PickerOption } from '@/features/shared/ui/Picker';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { ThemeMode } from '@/types/theme/theme';

const tkTypes: Record<ThemeMode, string> = {
  [ThemeMode.dark]: tk.displaySection.dark,
  [ThemeMode.light]: tk.displaySection.light,
  [ThemeMode.system]: tk.displaySection.system,
};

type ThemeOption = PickerOption & {
  value: ThemeMode;
};

export const ThemeField = () => {
  const { t } = useTranslation();
  const { changeThemeMode, themeMode } = useTheme();
  const handleThemeChange = async (theme: ThemeOption) => {
    await changeThemeMode(theme.value);
  };

  const options = useMemo<ThemeOption[]>(() => {
    const types = Object.values(ThemeMode) as ThemeMode[];
    return types.map((type) => ({
      id: type,
      value: type,
    }));
  }, []);

  const [selectedOption, setSelectedOption] = useState<ThemeOption>(options[0]);

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === themeMode) ?? options[0]);
  }, [themeMode, options]);

  return (
    <AppField label={t(tk.displaySection.theme)} icon={'pencil.and.scribble'}>
      <Picker
        options={options}
        selectedOption={selectedOption}
        onSelectOption={(option) => handleThemeChange(option).catch(console.error)}
        onOptionLabel={(option) => t(tkTypes[option.value])}
      />
    </AppField>
  );
};
