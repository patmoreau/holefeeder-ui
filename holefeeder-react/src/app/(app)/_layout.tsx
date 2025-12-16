import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PurchaseButton } from '@/features/shared/ui/components/PurchaseButton';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';

const AppLayout = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerRight: () => <PurchaseButton />,
        }}
      />
      <Stack.Screen
        name="purchase"
        options={{
          title: t(tk.purchase.title),
          headerTransparent: true,
          headerTintColor: theme.colors.tint,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Modal',
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
