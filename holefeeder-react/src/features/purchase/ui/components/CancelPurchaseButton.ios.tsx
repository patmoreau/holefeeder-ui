import { Host, Image } from '@expo/ui/swift-ui';
import * as React from 'react';

type CancelPurchaseButtonProps = {
  onCancel: () => void | Promise<void>;
};

export function CancelPurchaseButton({ onCancel }: CancelPurchaseButtonProps) {
  return (
    <Host style={{ width: 35, height: 35 }}>
      <Image systemName="chevron.backward" onPress={onCancel} />
    </Host>
  );
}
