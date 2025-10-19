import { Host, Button } from '@expo/ui/swift-ui';
import React from 'react';
import { View } from 'react-native';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useViewStyles } from '@/hooks/theme/use-styles';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

export const AuthButton: React.FC = () => {
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
      <Host style={viewStyles.host}>
        <Button variant="glassProminent" role="destructive" onPress={logout}>
          {t('auth.logoutButton')}
        </Button>
      </Host>
    );
  }

  return (
    <Host style={viewStyles.host}>
      <Button variant="glassProminent" onPress={login}>
        {t('auth.loginButton')}
      </Button>
    </Host>
  );
};
