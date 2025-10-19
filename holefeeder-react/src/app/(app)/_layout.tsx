import { Stack } from 'expo-router';
import { PurchaseButton } from '@/components/ui/purchase-button';
import { useColorScheme } from '@/shared/hooks/theme/use-color-scheme';
import { useLanguage } from '@/shared/hooks/use-language';

export default function AppLayout() {
  const { t } = useLanguage();
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
          title: t('purchase.title'),
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
