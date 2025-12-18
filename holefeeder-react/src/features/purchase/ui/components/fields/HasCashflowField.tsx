import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppSwitch } from '@/features/shared/ui/components/AppSwitch';
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
      <AppSwitch value={hasCashflow} onChange={onHasCashflowChange} />
    </AppField>
  );
};
