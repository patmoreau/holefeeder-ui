import { Form, Host } from '@expo/ui/swift-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { DisplaySection } from '@/features/settings/ui/display-section';
import { ProfileSection } from '@/features/settings/ui/profile-section';
import { tk } from '@/i18n/translations';

function ScreenContent() {
  const { t } = useTranslation();
  return (
    <ParallaxScrollView
      style={styles.container}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<IconSymbol size={310} color="#808080" name="gearshape" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer} lightColor={'#F2F2F7'} darkColor={'#000000'}>
        <ThemedText type="title">{t(tk.settings.title)}</ThemedText>
      </ThemedView>

      {Platform.select({
        ios: (
          <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
            <Form>
              <ProfileSection />
              <DisplaySection />
            </Form>
          </Host>
        ),
      })}
    </ParallaxScrollView>
  );
}

export default function SettingsScreen() {
  return <ScreenContent />;
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
  },
  container: {
    flex: 1,
    minHeight: '100%',
  },
});
