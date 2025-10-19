import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';
import { useTextStyles } from '@/shared/hooks/theme/use-styles';
import { useLanguage } from '@/shared/hooks/use-language';

export function LanguageSwitcher() {
  const { setUserLanguage, availableLanguages, currentLanguage } = useLanguage();
  const textStyles = useTextStyles();

  const handleLanguageChange = async (languageCode: 'en' | 'fr', index: number) => {
    await setUserLanguage(languageCode);
  };

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker
        style={textStyles.picker}
        selectedValue={currentLanguage}
        onValueChange={(code: 'en' | 'fr', index: number) => handleLanguageChange(code, index).then()}
      >
        {availableLanguages.map((lang) => (
          <Picker.Item key={lang.code} label={lang.name} value={lang.code} style={textStyles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
