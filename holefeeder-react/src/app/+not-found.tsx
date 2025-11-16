import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { Button } from '@/features/shared/ui/components/Button';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { GlobalStyles } from '@/types/theme/global-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  heading: {
    ...theme.typography.title,
    color: theme.colors.text,
    ...GlobalStyles.textCenter,
    ...GlobalStyles.py16,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.secondaryText,
    ...GlobalStyles.textCenter,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.link,
    textDecorationLine: 'underline' as const,
  },
  centered: {
    ...theme.styles.containers.center,
    backgroundColor: theme.colors.background,
  },
});

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t(tk.notFound.title),
          headerTitleStyle: styles.subtitle,
          headerTransparent: true,
          headerBackButtonMenuEnabled: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ThemedView style={styles.centered}>
        <Text style={styles.heading}>{t(tk.notFound.description)}</Text>
        <Button variant="primary" onPress={() => router.push({ pathname: '/' })}>
          <Text>{t(tk.notFound.goBack)}</Text>
        </Button>
      </ThemedView>
    </>
  );
}
