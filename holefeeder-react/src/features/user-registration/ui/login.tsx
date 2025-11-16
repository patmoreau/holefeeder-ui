import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { GlobalStyles } from '@/types/theme/global-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme, global: any) => ({
  centered: {
    ...theme.styles.containers.center,
    backgroundColor: theme.colors.background,
  },
  content: {
    width: '80%',
    maxWidth: 300,
    ...global.column,
    ...global.roundedLg,
    ...global.p24,
    ...global.alignCenter,
  },
  heading: {
    ...theme.typography.title,
    color: theme.colors.text,
    ...GlobalStyles.textCenter,
  },
  subtitle: {
    ...theme.typography.subtitle,
    color: theme.colors.secondaryText,
    ...global.textCenter,
    ...global.mb32,
  },
});

export default function LoginScreen() {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.centered}>
      <View style={styles.content}>
        <Text style={styles.heading}>{t(tk.auth.loginTitle)}</Text>
        <Text style={styles.subtitle}>{t(tk.auth.loginSubtitle)}</Text>
        <AuthButton />
      </View>
    </View>
  );
}
