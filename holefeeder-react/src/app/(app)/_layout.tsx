import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';

const AppLayout = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const onPressPurchase = () => router.push('/(app)/purchase');

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerRight: () => (
            <AppButton
              icon={AppIcons.purchase}
              style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
              onPress={onPressPurchase}
            />
          ),
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
