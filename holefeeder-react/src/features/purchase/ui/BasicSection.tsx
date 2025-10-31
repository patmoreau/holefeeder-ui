import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { AccountPicker } from '@/features/purchase/ui/components/AccountPicker';
import { AmountTextField } from '@/features/purchase/ui/components/AmountTextField';
import { CategoryPicker } from '@/features/purchase/ui/components/CategoryPicker';
import { DatePicker } from '@/features/purchase/ui/components/DatePicker';
import { useLanguage } from '@/shared/hooks/use-language';

interface Props {
  accounts: Account[];
  categories: Category[];
}

export function BasicSection({ accounts, categories }: Props) {
  const { t } = useLanguage();
  const { formData, updateFormField } = usePurchaseForm();

  const updateAccount = (account: Account) => updateFormField('account', account);

  const updateCategory = (category: Category) => updateFormField('category', category);
  return (
    <Section title={t('purchase.basicSection.title')}>
      <LabeledContent label={t('purchase.basicSection.amount')}>
        <AmountTextField initialAmount={formData.amount} onAmountChange={(amount) => updateFormField('amount', amount)} />
      </LabeledContent>
      <LabeledContent label={t('purchase.basicSection.date')}>
        <DatePicker selectedDate={formData.date} onDateSelected={(date) => updateFormField('date', date)} />
      </LabeledContent>
      <LabeledContent label={t('purchase.basicSection.account')}>
        <AccountPicker accounts={accounts} selectedAccount={formData.account || accounts?.[0] || null} onSelectAccount={updateAccount} />
      </LabeledContent>
      <LabeledContent label={t('purchase.basicSection.category')}>
        <CategoryPicker
          categories={categories}
          selectedCategory={formData.category || categories?.[0] || null}
          onSelectCategory={updateCategory}
        />
      </LabeledContent>
    </Section>
  );
}
