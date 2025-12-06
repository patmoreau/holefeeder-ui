import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppPicker, PickerOption } from '@/features/shared/ui/AppPicker';
import { tk } from '@/i18n/translations';
import { useLanguage } from '@/shared/hooks/use-language';
import { LanguageType } from '@/types/app-state';
import { AppIcons } from '@/types/icons';

const tkTypes: Record<LanguageType, string> = {
  [LanguageType.en]: tk.displaySection.english,
  [LanguageType.fr]: tk.displaySection.french,
};

type LanguageOption = PickerOption & {
  value: LanguageType;
};

export const LanguageField = () => {
  const { t } = useTranslation();
  const { setUserLanguage, currentLanguage } = useLanguage();
  const handleLanguageChange = async (language: LanguageOption) => {
    await setUserLanguage(language.value);
  };

  const options = useMemo<LanguageOption[]>(() => {
    const types = Object.values(LanguageType) as LanguageType[];
    return types.map((type) => ({
      id: type,
      value: type,
    }));
  }, []);

  const [selectedOption, setSelectedOption] = useState<LanguageOption>(options[0]);

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === currentLanguage) ?? options[0]);
  }, [currentLanguage, options]);

  return (
    <AppField label={t(tk.displaySection.language)} icon={AppIcons.language}>
      <AppPicker
        options={options}
        selectedOption={selectedOption}
        onSelectOption={(option) => handleLanguageChange(option).catch(console.error)}
        onOptionLabel={(option) => t(tkTypes[option.value])}
      />
    </AppField>
  );
};
