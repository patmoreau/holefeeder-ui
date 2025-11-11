import { Button, Host } from '@expo/ui/swift-ui';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
import { tk } from '@/i18n/translations';
import { useTextStyles, useViewStyles } from '@/shared/hooks/theme/use-styles';
import { GlobalStyles } from '@/types/theme/global-styles';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const containerStyles = useViewStyles();
  const textStyles = useTextStyles();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t(tk.notFound.title),
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
        <Text style={[textStyles.heading, GlobalStyles.py16]}>{t(tk.notFound.description)}</Text>
        <Host style={containerStyles.host}>
          <Button
            variant="link"
            onPress={() => {
              router.push({ pathname: '/' });
            }}
          >
            {t(tk.notFound.goBack)}
          </Button>
        </Host>
      </ThemedView>
    </>
  );
}
