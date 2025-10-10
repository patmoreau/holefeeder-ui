import { Stack } from 'expo-router';
import { PurchaseButton } from '@/components/ui/purchase-button';

export default function AppLayout() {
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
      <Stack.Screen name="purchase" />
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
