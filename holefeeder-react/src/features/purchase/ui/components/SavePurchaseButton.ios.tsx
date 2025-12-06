import { Host, Image } from '@expo/ui/swift-ui';
import * as React from 'react';
import { AppIcons } from '@/types/icons';

type SavePurchaseButtonProps = {
  onSave: () => void | Promise<void>;
};

export function SavePurchaseButton({ onSave }: SavePurchaseButtonProps) {
  return (
    <Host style={{ width: 35, height: 35 }}>
      <Image systemName={AppIcons.save} onPress={onSave} />
    </Host>
  );
}
