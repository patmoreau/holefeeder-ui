import { Host, Image } from '@expo/ui/swift-ui';
import { router } from 'expo-router';
import * as React from 'react';
import { AppIcons } from '@/types/icons';

export const PurchaseButton = () => {
  return (
    <Host style={{ width: 35, height: 35 }}>
      <Image systemName={AppIcons.purchase} onPress={() => router.push('/(app)/purchase')} />
    </Host>
  );
};
