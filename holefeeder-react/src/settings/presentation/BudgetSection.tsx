import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppSection } from '@/features/shared/ui/AppSection';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { tk } from '@/i18n/translations';
import { AppIcons } from '@/types/icons';

export function BudgetSection() {
  const { t } = useTranslation();

  return (
    <AppSection title={t(tk.budgetSection.title)}>
      <AppField label={t(tk.budgetSection.budget)} icon={AppIcons.settings}>
        <AppButton
          label={t(tk.budgetSection.settings)}
          icon={AppIcons.expand}
          iconPosition={'right'}
          variant={'link'}
          onPress={() => {
            router.push('/(app)/budgetSettings');
          }}
        />
      </AppField>
    </AppSection>
  );
}
