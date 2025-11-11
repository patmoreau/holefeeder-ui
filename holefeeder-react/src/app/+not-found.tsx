import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text } from 'react-native';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
import { tk } from '@/i18n/translations';
import { useStyles, useTextStyles, useViewStyles } from '@/shared/hooks/theme/use-styles';
import { GlobalStyles } from '@/types/theme/global-styles';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const containerStyles = useViewStyles();
  const textStyles = useTextStyles();

  const styles = useStyles((_) => ({
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      ...(Platform.OS === 'web' && {
        cursor: 'pointer',
        ':hover': {
          opacity: 0.8,
        },
      }),
    },
    buttonText: {
      ...textStyles.link,
      textDecorationLine: 'underline',
    },
  }));

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
        <Pressable style={styles.button} onPress={() => router.push({ pathname: '/' })} role="link">
          <Text style={styles.buttonText}>{t(tk.notFound.goBack)}</Text>
        </Pressable>
      </ThemedView>
    </>
  );
}
