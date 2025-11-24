import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { AppText } from '@/features/shared/ui/components/AppText';
import { AppView } from '@/features/shared/ui/components/AppView';
import { ScreenTitle } from '@/features/shared/ui/components/ScreenTitle';
import { tk } from '@/i18n/translations';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ParallaxScrollView
      style={styles.content}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
    >
      <ScreenTitle title={t(tk.home.title)} />
      <AppView style={styles.stepContainer}>
        <AppText variant="subtitle">Step 1: Try it</AppText>
        <AppText>
          Edit <AppText variant="defaultSemiBold">app/(tabs)/index.tsx</AppText> to see changes. Press{' '}
          <AppText variant="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </AppText>{' '}
          to open developer tools.
        </AppText>
      </AppView>
      <AppView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <AppText variant="subtitle">Step 2: Explore</AppText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => alert('Share pressed')} />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => alert('Delete pressed')} />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <AppText>{`Tap the Explore tab to learn more about what's included in this starter app.`}</AppText>
      </AppView>
      <AppView style={styles.stepContainer}>
        <AppText variant="subtitle">Step 3: Get a fresh start</AppText>
        <AppText>
          {`When you're ready, run `}
          <AppText variant="defaultSemiBold">npm run reset-project</AppText> to get a fresh <AppText variant="defaultSemiBold">app</AppText>{' '}
          directory. This will move the current <AppText variant="defaultSemiBold">app</AppText> to{' '}
          <AppText variant="defaultSemiBold">app-example</AppText>.
        </AppText>
      </AppView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
