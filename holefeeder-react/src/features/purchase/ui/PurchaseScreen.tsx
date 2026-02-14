import React from 'react';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { PurchaseFormProvider, validatePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { PurchaseForm } from '@/features/purchase/ui/PurchaseForm';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { withDate } from '@/features/shared/utils/with-date';
import { useAccounts } from '@/presentation/hooks/accounts/use-accounts';
import { useCategories } from '@/presentation/hooks/categories/use-categories';
import { useTags } from '@/presentation/hooks/flows/use-tags';
import { useMultipleWatches } from '@/presentation/hooks/use-multiple-watches';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
});

const PurchaseScreen = () => {
  const accountsQuery = useAccounts();
  const categoriesQuery = useCategories();
  const tagsQuery = useTags();
  const styles = useStyles(createStyles);

  const { data, isLoading, errors } = useMultipleWatches({
    accounts: () => accountsQuery,
    categories: () => categoriesQuery,
    tags: () => tagsQuery,
  });

  if (isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { accounts, categories, tags } = data;

  const initialData: PurchaseFormData = {
    purchaseType: PurchaseType.expense,
    date: withDate(new Date()).toDateOnly(),
    amount: 0,
    description: '',
    sourceAccount: accounts[0],
    category: categories[0],
    tags: [],
    hasCashflow: false,
    cashflowEffectiveDate: withDate(new Date()).toDateOnly(),
    cashflowIntervalType: 'monthly',
    cashflowFrequency: 1,
    targetAccount: accounts![1] || accounts![0],
  };

  return (
    <AppScreen>
      <PurchaseFormProvider initialValue={initialData} validate={validatePurchaseForm} validateOnChange>
        <PurchaseForm accounts={accounts!} categories={categories!} tags={tags!} />
      </PurchaseFormProvider>
      <ErrorSheet {...errors} />
    </AppScreen>
  );
};

export default PurchaseScreen;
