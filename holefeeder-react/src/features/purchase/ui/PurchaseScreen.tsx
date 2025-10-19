import React from 'react';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { useCategories } from '@/features/purchase/core/use-categories';
import { PurchaseFormProvider } from '@/features/purchase/core/use-purchase-form';
import { PurchaseForm } from '@/features/purchase/ui/PurchaseForm';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { withDate } from '@/features/shared/utils/with-date';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';

export default function PurchaseScreen() {
  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();

  const { isLoading, data, errorSheetProps } = useDataFetchingErrorHandler(accountsQuery, categoriesQuery);

  if (isLoading || !data) {
    return (
      <>
        <LoadingIndicator />
        <ErrorSheet {...errorSheetProps} />
      </>
    );
  }

  const [accounts, categories] = data;

  const initialData = {
    date: withDate(new Date()).toDateOnly(),
    amount: 0,
    description: '',
    account: accounts![0],
    category: categories![0],
    tags: [],
  };

  return (
    <>
      <PurchaseFormProvider initialValue={initialData}>
        <PurchaseForm accounts={accounts!} categories={categories!} />
      </PurchaseFormProvider>
      <ErrorSheet {...errorSheetProps} />
    </>
  );
}
