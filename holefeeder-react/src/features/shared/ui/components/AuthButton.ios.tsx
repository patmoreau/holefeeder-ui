import { Button, Host } from '@expo/ui/swift-ui';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  host: {
    ...theme.styles.containers.section,
    width: '80%',
    maxWidth: 300,
  },
});
export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  if (isLoading) {
    return <LoadingIndicator size="large" />;
  }

  if (user) {
    return (
      <Host style={styles.host}>
        <Button variant="glassProminent" role="destructive" onPress={logout}>
          {t(tk.auth.logoutButton)}
        </Button>
      </Host>
    );
  }

  const label = t(tk.auth.loginButton);
  return (
    <Host style={styles.host}>
      <Button variant="glassProminent" onPress={login}>
        {label}
      </Button>
    </Host>
  );
};
