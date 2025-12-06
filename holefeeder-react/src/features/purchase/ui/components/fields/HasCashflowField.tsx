import { Host, Switch } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { tk } from '@/i18n/translations';
import { AppIcons } from '@/types/icons';

type Props = {
  hasCashflow: boolean;
  onHasCashflowChange: (hasCashflow: boolean) => void;
};

export const HasCashflowField = ({ hasCashflow, onHasCashflowChange }: Props) => {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.purchase.cashflowSection.cashflow)} icon={AppIcons.cashflow}>
      <Host matchContents>
        <Switch value={hasCashflow} onValueChange={onHasCashflowChange} modifiers={[padding({ trailing: 2 })]} />
      </Host>
    </AppField>
  );
};
