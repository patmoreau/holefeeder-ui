import { router, Stack } from 'expo-router';
import { Text, Pressable, Platform } from 'react-native';
import { ThemedView } from '@/components';
import { GlobalStyles } from '@/constants/global-styles';
import { useContainerStyles, useLanguage, useTextStyles, useStyles } from '@/hooks';
import { getThemedTypography } from '@/utils/style-utils';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const containerStyles = useContainerStyles();
  const textStyles = useTextStyles();

  const styles = useStyles((theme) => ({
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
      ...getThemedTypography(theme, 'body', 'systemBlue'),
      textDecorationLine: 'underline',
    },
  }));

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
        <Pressable style={styles.button} onPress={() => router.push({ pathname: '/' })} role="link">
          <Text style={styles.buttonText}>{t('not-found.go-back')}</Text>
        </Pressable>
      </ThemedView>
    </>
  );
}
