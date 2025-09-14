import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts';
import {
  HelloWave,
  IconSymbol,
  ParallaxScrollView,
  ThemedText,
  ThemedView,
} from '@/components';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Switch } from '@expo/ui/swift-ui';
import NativeForm from '@/components/ui/native-form';
import NativeSection from '@/components/ui/native-section';

export default function ProfileScreen() {
  const { t } = useLanguage();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  return (
    <ParallaxScrollView
      style={styles.container}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear.circle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('home.title')}</ThemedText>
        <HelloWave />
      </ThemedView>

      <NativeForm>
        <NativeSection title={t('settings.parameters')}>
          <Switch
            value={switchValue}
            label="This is a switch"
            onValueChange={setSwitchValue}
          />
          <LanguageSwitcher
            visible={showLanguageSwitcher}
            onClose={() => setShowLanguageSwitcher(false)}
          />
        </NativeSection>
      </NativeForm>
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
    alignItems: 'center',
    gap: 16,
    padding: 32,
    backgroundColor: '#ECEDEE',
  },
  container: {
    flex: 1,
    minHeight: '100%',
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
