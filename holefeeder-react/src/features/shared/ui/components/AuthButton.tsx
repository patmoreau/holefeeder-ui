import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from '@/features/shared/ui/components/Button';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useViewStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';

export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useTranslation();
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
          {t(tk.auth.logoutButton)}
        </Button>
      </View>
    );
  }

  return (
    <View style={viewStyles.primary}>
      <Button variant="primary" onPress={login}>
        {t(tk.auth.loginButton)}
      </Button>
    </View>
  );
};
