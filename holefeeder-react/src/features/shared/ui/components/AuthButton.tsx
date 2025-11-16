import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from '@/features/shared/ui/components/Button';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useAuth } from '@/shared/hooks/use-auth';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  centered: {
    ...theme.styles.containers.center,
    backgroundColor: theme.colors.background,
  },
  primary: {
    ...theme.styles.containers.page,
    backgroundColor: theme.colors.background,
  },
});

export const AuthButton = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.primary}>
        <Button variant="destructive" onPress={logout}>
          {t(tk.auth.logoutButton)}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.primary}>
      <Button variant="primary" onPress={login}>
        {t(tk.auth.loginButton)}
      </Button>
    </View>
  );
};
