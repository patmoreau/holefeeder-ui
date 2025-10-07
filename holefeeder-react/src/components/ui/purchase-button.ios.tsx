import { Host, Image } from '@expo/ui/swift-ui';
import * as React from 'react';
import { router } from 'expo-router';

export default function PurchaseButtonIos() {
  return (
    <Host style={{ width: 35, height: 35 }}>
      <Image
        systemName="cart.badge.plus"
        onPress={() => router.push('/(app)/purchase')}
      />
    </Host>
  );
}
