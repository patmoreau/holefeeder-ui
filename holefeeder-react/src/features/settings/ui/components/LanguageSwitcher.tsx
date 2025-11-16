import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, View } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLanguage } from '@/shared/hooks/use-language';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  picker: {
    ...theme.styles.components.picker,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.separator,
  },
  pickerItem: {
    ...theme.styles.components.pickerItem,
    ...Platform.select({
      web: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      },
      default: {},
    }),
  },
});

export function LanguageSwitcher() {
  const { setUserLanguage, availableLanguages, currentLanguage } = useLanguage();
  const styles = useStyles(createStyles);

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
        style={styles.picker}
        selectedValue={currentLanguage}
        onValueChange={(code: 'en' | 'fr', index: number) => handleLanguageChange(code, index).then()}
      >
        {availableLanguages.map((lang) => (
          <Picker.Item key={lang.code} label={lang.name} value={lang.code} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
