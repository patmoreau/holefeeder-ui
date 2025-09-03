import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useLanguage } from '@/contexts';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LanguageSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSwitcher({ visible, onClose }: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, availableLanguages, t } =
    useLanguage();

  const handleLanguageChange = async (languageCode: 'en' | 'fr') => {
    await changeLanguage(languageCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{t('settings.selectLanguage')}</Text>

            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && styles.selectedLanguage,
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text
                  style={[
                    styles.languageText,
                    currentLanguage === language.code &&
                      styles.selectedLanguageText,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage === language.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
});
