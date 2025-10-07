import React from 'react';
import { View, Text } from 'react-native';
import { AuthButton } from '@/components';
import {
  useLanguage,
  useStyles,
  useContainerStyles,
  useTextStyles,
} from '@/hooks';

export default function LoginScreen() {
  const { t } = useLanguage();
  const containerStyles = useContainerStyles();
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
        <Text style={textStyles.heading}>{t('auth.loginTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
        <AuthButton />
      </View>
    </View>
  );
}
