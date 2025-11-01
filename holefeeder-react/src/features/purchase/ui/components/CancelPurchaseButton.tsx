import * as React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/features/shared/ui/components/Button';

type CancelPurchaseButtonProps = {
  onCancel: () => void | Promise<void>;
};

export function CancelPurchaseButton({ onCancel }: CancelPurchaseButtonProps) {
  return (
    <Button onPress={onCancel}>
      <IconSymbol name={'chevron.backward'} color={'primary'} />
    </Button>
  );
}
