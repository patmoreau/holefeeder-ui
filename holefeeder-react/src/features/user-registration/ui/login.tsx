import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { tk } from '@/i18n/translations';
import { useStyles, useTextStyles, useViewStyles } from '@/shared/hooks/theme/use-styles';

export default function LoginScreen() {
  const { t } = useTranslation();
  const containerStyles = useViewStyles();
  const textStyles = useTextStyles();

  const styles = useStyles((theme, global) => ({
    content: {
      width: '80%',
      maxWidth: 300,
      ...global.column,
      ...global.roundedLg,
      ...global.p24,
      ...global.alignCenter,
    },
    subtitle: {
      ...textStyles.subtitle,
      ...global.mb32,
    },
  }));

  return (
    <View style={containerStyles.centered}>
      <View style={styles.content}>
        <Text style={textStyles.heading}>{t(tk.auth.loginTitle)}</Text>
        <Text style={styles.subtitle}>{t(tk.auth.loginSubtitle)}</Text>
        <AuthButton />
      </View>
    </View>
  );
}
