import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppView } from '@/features/shared/ui/AppView';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { AppText } from '@/features/shared/ui/components/AppText';
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
      <AppView style={styles.centered}>
        <AppText variant="title">{t(tk.notFound.description)}</AppText>
        <AppButton label={t(tk.notFound.goBack)} variant="primary" onPress={() => router.push({ pathname: '/' })} />
      </AppView>
    </>
  );
}
