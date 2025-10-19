import React from 'react';
import { View } from 'react-native';
import { Button } from '@/features/shared/ui/components/Button';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useViewStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { useLanguage } from '@/shared/hooks/use-language';

export function AuthButton() {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const viewStyles = useViewStyles();

  if (isLoading) {
    return (
      <View style={viewStyles.centered}>
        <LoadingIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return (
      <View style={viewStyles.primary}>
        <Button variant="destructive" onPress={logout}>
          {t('auth.logoutButton')}
        </Button>
      </View>
    );
  }

  return (
    <View style={viewStyles.primary}>
      <Button variant="primary" onPress={login}>
        {t('auth.loginButton')}
      </Button>
    </View>
  );
}
