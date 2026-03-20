import React from 'react';
import { useMultipleWatches, withDefault } from '@/features/shared/core/use-multiple-watches';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { today } from '@/features/shared/utils/with-date';
import { PurchaseFormData, PurchaseType } from '@/flows/purchase/presentation/core/purchase-form-data';
import { useAccounts } from '@/flows/purchase/presentation/core/use-accounts';
import { useCategories } from '@/flows/purchase/presentation/core/use-categories';
import { PurchaseFormProvider, validatePurchaseForm } from '@/flows/purchase/presentation/core/use-purchase-form';
import { useTags } from '@/flows/purchase/presentation/core/use-tags';
import { PurchaseForm } from '@/flows/purchase/presentation/PurchaseForm';
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
    accounts: withDefault(() => accountsQuery, []),
    categories: withDefault(() => categoriesQuery, []),
    tags: withDefault(() => tagsQuery, []),
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
    date: today(),
    amount: 0,
    description: '',
    sourceAccount: accounts[0],
    category: categories[0],
    tags: [],
    hasCashflow: false,
    cashflowEffectiveDate: today(),
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
