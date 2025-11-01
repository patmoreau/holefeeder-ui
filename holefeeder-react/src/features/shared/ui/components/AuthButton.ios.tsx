import { Host, Button } from '@expo/ui/swift-ui';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useViewStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { useLanguage } from '@/shared/hooks/use-language';

export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useLanguage();
  const viewStyles = useViewStyles();

  if (isLoading) {
    return <LoadingIndicator size="large" />;
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
