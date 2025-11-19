import { Host, Switch } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/features/shared/ui/Field';
import { tk } from '@/i18n/translations';

type Props = {
  hasCashflow: boolean;
  onHasCashflowChange: (hasCashflow: boolean) => void;
};

export const HasCashflowField = ({ hasCashflow, onHasCashflowChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Field label={t(tk.purchase.cashflowSection.cashflow)} iconSymbolName={'arrow.trianglehead.2.clockwise'}>
      <Host matchContents>
        <Switch value={hasCashflow} onValueChange={onHasCashflowChange} modifiers={[padding({ trailing: 2 })]} />
      </Host>
    </Field>
  );
};
