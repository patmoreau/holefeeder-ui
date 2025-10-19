import { Picker } from '@expo/ui/swift-ui';
import React, { useState } from 'react';
import { useLanguage } from '@/shared/hooks/use-language';

export function LanguageSwitcher() {
  const { setUserLanguage, availableLanguages, currentLanguage } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(availableLanguages.findIndex((lang) => lang.code === currentLanguage));
  const handleLanguageChange = async (languageCode: 'en' | 'fr') => {
    await setUserLanguage(languageCode);
  };

  return (
    <Picker
      modifiers={[]}
      options={availableLanguages.map((language) => language.name)}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableLanguages[index].code).finally(() => setSelectedIndex(index));
      }}
      variant="menu"
    />
  );
}
