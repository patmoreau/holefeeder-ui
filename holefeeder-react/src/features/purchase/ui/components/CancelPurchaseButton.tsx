import * as React from 'react';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { AppIcons } from '@/types/icons';

type CancelPurchaseButtonProps = {
  onCancel: () => void | Promise<void>;
};

export function CancelPurchaseButton({ onCancel }: CancelPurchaseButtonProps) {
  return <AppButton icon={AppIcons.back} onPress={onCancel} />;
}
