import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { useAccounts } from '@/features/purchase/core/use-accounts';
import { useCategories } from '@/features/purchase/core/use-categories';
import { PurchaseFormProvider, usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { usePurchaseFormHeader } from '@/features/purchase/core/use-purchase-form-header';
import { useTags } from '@/features/purchase/core/use-tags';
import { PurchaseFormContent } from '@/features/purchase/ui/PurchaseFormContent';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { withDate } from '@/features/shared/utils/with-date';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';

function PurchaseFormWithHeader({ accounts, categories, tags }: { accounts: Account[]; categories: Category[]; tags: Tag[] }) {
  const { formData, isDirty } = usePurchaseForm();

  usePurchaseFormHeader({
    isDirty,
    formData,
    onSave: async () => {
      console.log('Saving purchase:', formData);
    },
  });

  return <PurchaseFormContent accounts={accounts} categories={categories} tags={tags} />;
}

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
        <PurchaseFormWithHeader accounts={accounts!} categories={categories!} tags={tags!} />
      </PurchaseFormProvider>
      <ErrorSheet {...errorSheetProps} />
    </>
  );
}
