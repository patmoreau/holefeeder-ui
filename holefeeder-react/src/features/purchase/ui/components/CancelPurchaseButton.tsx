import * as React from 'react';
import { AppButton } from '@/features/shared/ui/components/AppButton';

type CancelPurchaseButtonProps = {
  onCancel: () => void | Promise<void>;
};

export function CancelPurchaseButton({ onCancel }: CancelPurchaseButtonProps) {
  return <AppButton icon={'chevron.backward'} onPress={onCancel} />;
}
