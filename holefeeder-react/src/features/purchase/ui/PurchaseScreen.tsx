import React from 'react';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { useCategories } from '@/features/purchase/core/use-categories';
import { PurchaseFormProvider, validatePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { useTags } from '@/features/purchase/core/use-tags';
import { PurchaseForm } from '@/features/purchase/ui/PurchaseForm';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { withDate } from '@/features/shared/utils/with-date';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';

export default function PurchaseScreen() {
  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const tagsQuery = useTags();

  const { isLoading, data, errorSheetProps } = useDataFetchingErrorHandler(accountsQuery, categoriesQuery, tagsQuery);

  if (isLoading || !data) {
    return (
      <>
        <LoadingIndicator />
        <ErrorSheet {...errorSheetProps} />
      </>
    );
  }

  const [accounts, categories, tags] = data;

  const initialData: PurchaseFormData = {
    purchaseType: PurchaseType.expense,
    date: withDate(new Date()).toDateOnly(),
    amount: 0,
    description: '',
    sourceAccount: accounts![0],
    category: categories![0],
    tags: [],
    hasCashflow: false,
    cashflowEffectiveDate: withDate(new Date()).toDateOnly(),
    cashflowIntervalType: 'monthly',
    cashflowFrequency: 1,
    targetAccount: accounts![1] || accounts![0],
  };

  return (
    <>
      <PurchaseFormProvider initialValue={initialData} validate={validatePurchaseForm} validateOnChange>
        <PurchaseForm accounts={accounts!} categories={categories!} tags={tags!} />
      </PurchaseFormProvider>
      <ErrorSheet {...errorSheetProps} />
    </>
  );
}
