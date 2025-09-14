import { Picker } from '@expo/ui/jetpack-compose';
import React, { useState } from 'react';
import { useLanguage } from '@/contexts';

interface LanguageSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSwitcher({ visible, onClose }: LanguageSwitcherProps) {
  const { changeLanguage, availableLanguages } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleLanguageChange = async (languageCode: 'en' | 'fr') => {
    await changeLanguage(languageCode);
  };

  return (
    <Picker
      options={availableLanguages.map((language) => language.name)}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        setSelectedIndex(index);
      }}
      variant="segmented"
    />
  );
}
