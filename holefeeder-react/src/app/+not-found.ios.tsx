import { Button, Host } from '@expo/ui/swift-ui';
import { router, Stack } from 'expo-router';
import { Text } from 'react-native';
import { ThemedView } from '@/components';
import { GlobalStyles } from '@/constants/global-styles';
import { useContainerStyles, useLanguage, useTextStyles } from '@/hooks';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const containerStyles = useContainerStyles();
  const textStyles = useTextStyles();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('not-found.title'),
          headerTitleStyle: {
            fontSize: textStyles.subtitle.fontSize,
            fontWeight: textStyles.subtitle.fontWeight,
            fontFamily: textStyles.subtitle.fontFamily,
          },
          headerTransparent: true,
          headerBackButtonMenuEnabled: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ThemedView style={containerStyles.centered}>
        <Text style={[textStyles.heading, GlobalStyles.py16]}>{t('not-found.description')}</Text>
        <Host style={containerStyles.host}>
          <Button
            variant="link"
            onPress={() => {
              router.push({ pathname: '/' });
            }}
          >
            {t('not-found.go-back')}
          </Button>
        </Host>
      </ThemedView>
    </>
  );
}
