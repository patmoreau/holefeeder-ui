import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React, { useState } from 'react';
import { Account } from '@/core/account';
import { Category } from '@/core/category';
import { useAccounts } from '@/hooks/queries/use-accounts';
import { useCategories } from '@/hooks/queries/use-categories';
import { useLanguage } from '@/hooks/use-language';
import { AccountPicker } from '@/use-cases/purchase/ui/components/AccountPicker';
import { AmountTextField } from '@/use-cases/purchase/ui/components/AmountTextField';
import { CategoryPicker } from '@/use-cases/purchase/ui/components/CategoryPicker';
import { DatePicker } from '@/use-cases/purchase/ui/components/DatePicker';

export function BasicSection() {
  const { t } = useLanguage();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  // Form state
  const [selectedDate, setSelectedDate] = useState<string | null>('2016-12-28');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <Section title={t('purchase.basic-section.title')}>
      <LabeledContent label={t('purchase.basic-section.amount')}>
        <AmountTextField initialAmount={12.34} style={{ width: '65%' }} onAmountChange={(amount) => console.log(`Amount: ${amount}`)} />
      </LabeledContent>
      <LabeledContent label={t('purchase.basic-section.date')}>
        <DatePicker selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      </LabeledContent>
      <LabeledContent label={t('purchase.basic-section.account')}>
        <AccountPicker
          accounts={accounts || []}
          selectedAccount={selectedAccount || accounts?.[0] || null}
          onSelectAccount={setSelectedAccount}
        />
      </LabeledContent>
      <LabeledContent label={t('purchase.basic-section.category')}>
        <CategoryPicker
          categories={categories || []}
          selectedCategory={selectedCategory || categories?.[0] || null}
          onSelectCategory={setSelectedCategory}
        />
      </LabeledContent>
    </Section>
  );
}
