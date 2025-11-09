import { Host, Button } from '@expo/ui/swift-ui';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useViewStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';

export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useTranslation();
  const viewStyles = useViewStyles();

  if (isLoading) {
    return <LoadingIndicator size="large" />;
  }

  if (user) {
    return (
      <Host style={viewStyles.host}>
        <Button variant="glassProminent" role="destructive" onPress={logout}>
          {t(tk.auth.logoutButton)}
        </Button>
      </Host>
    );
  }

  return (
    <Host style={viewStyles.host}>
      <Button variant="glassProminent" onPress={login}>
        {t(tk.auth.loginButton)}
      </Button>
    </Host>
  );
};
