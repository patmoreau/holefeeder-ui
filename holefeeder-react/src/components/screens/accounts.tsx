import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { ExternalLink } from '@/components/external-link';
import { Collapsible } from '@/components/ui/collapsible';
import { AppText } from '@/features/shared/ui/components/AppText';
import { IconSymbol } from '@/features/shared/ui/components/IconSymbol';
import { ScreenTitle } from '@/features/shared/ui/components/ScreenTitle';
import { ParallaxScrollView } from '@/features/shared/ui/ParallaxScrollView';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';
import { Fonts } from '@/types/theme/theme';

export default function AccountsScreen() {
  const { theme } = useTheme();
  return (
    <ParallaxScrollView
      style={styles.content}
      headerBackgroundColor={theme.colors.accounts}
      headerImage={<IconSymbol size={310} color="#808080" name={AppIcons.accounts} style={styles.headerImage} />}
    >
      <ScreenTitle title={'Explore'} />
      <AppText>This app includes example code to help you get started.</AppText>
      <Collapsible title="File-based routing">
        <AppText>
          This app has two screens: <AppText variant="defaultSemiBold">app/(tabs)/index.tsx</AppText> and{' '}
          <AppText variant="defaultSemiBold">app/(tabs)/explore.tsx</AppText>
        </AppText>
        <AppText>
          The layout file in <AppText variant="defaultSemiBold">app/(tabs)/_layout.tsx</AppText> sets up the tab navigator.
        </AppText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <AppText variant="link">Learn more</AppText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <AppText>
          You can open this project on Android, iOS, and the web. To open the web version, press <AppText variant="defaultSemiBold">w</AppText>{' '}
          in the terminal running this project.
        </AppText>
      </Collapsible>
      <Collapsible title="Images">
        <AppText>
          For static images, you can use the <AppText variant="defaultSemiBold">@2x</AppText> and{' '}
          <AppText variant="defaultSemiBold">@3x</AppText> suffixes to provide files for different screen densities
        </AppText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <AppText variant="link">Learn more</AppText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <AppText>
          This template has light and dark mode support. The <AppText variant="defaultSemiBold">useColorScheme()</AppText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </AppText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <AppText variant="link">Learn more</AppText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <AppText>
          This template includes an example of an animated component. The <AppText variant="defaultSemiBold">components/HelloWave.tsx</AppText>{' '}
          component uses the powerful{' '}
          <AppText variant="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </AppText>{' '}
          library to create a waving hand animation.
        </AppText>
        {Platform.select({
          ios: (
            <AppText>
              The <AppText variant="defaultSemiBold">components/ParallaxScrollView.tsx</AppText> component provides a parallax effect for the
              header image.
            </AppText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
