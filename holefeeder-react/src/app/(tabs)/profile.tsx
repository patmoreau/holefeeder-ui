import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/contexts';
import {
  IconSymbol,
  LanguageSwitcher,
  ParallaxScrollView,
  ThemedText,
  ThemedView,
  UserProfile,
} from '@/components';

export default function ProfileScreen() {
  const { t, currentLanguage, availableLanguages } = useLanguage();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const getCurrentLanguageName = () => {
    return (
      availableLanguages.find((lang) => lang.code === currentLanguage)?.name ||
      'English'
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.circle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('settings.title')}</ThemedText>
      </ThemedView>

      <UserProfile />

      <ThemedView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">{t('settings.parameters')}</ThemedText>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowLanguageSwitcher(true)}
          >
            <ThemedText>{t('settings.language')}</ThemedText>
            <ThemedText style={styles.settingValue}>
              {getCurrentLanguageName()}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <LanguageSwitcher
        visible={showLanguageSwitcher}
        onClose={() => setShowLanguageSwitcher(false)}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    marginTop: 10,
  },
  settingValue: {
    color: '#007AFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 50,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
