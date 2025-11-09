import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PurchaseButton } from '@/components/ui/purchase-button';
import { tk } from '@/i18n/translations';
import { useColorScheme } from '@/shared/hooks/theme/use-color-scheme';

export default function AppLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

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
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
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
}
