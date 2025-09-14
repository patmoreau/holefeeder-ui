import React, { useState } from 'react';
import { useLanguage } from '@/contexts';
import { Picker } from '@expo/ui/swift-ui';
import { useWindowDimensions } from 'react-native';

interface LanguageSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSwitcher({ visible, onClose }: LanguageSwitcherProps) {
  const { changeLanguage, availableLanguages, t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleLanguageChange = async (languageCode: 'en' | 'fr') => {
    await changeLanguage(languageCode);
    onClose();
  };

  return (
    <Picker
      modifiers={[]}
      options={availableLanguages.map((language) => language.name)}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        handleLanguageChange(availableLanguages[index].code);
        setSelectedIndex(index);
      }}
      label={t('settings.selectLanguage')}
      variant="menu"
    />
  );
}
