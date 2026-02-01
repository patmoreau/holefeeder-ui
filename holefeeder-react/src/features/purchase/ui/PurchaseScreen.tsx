import React from 'react';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { useCategories } from '@/features/purchase/core/use-categories';
import { PurchaseFormProvider, validatePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { useTags } from '@/features/purchase/core/use-tags';
import { PurchaseForm } from '@/features/purchase/ui/PurchaseForm';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { withDate } from '@/features/shared/utils/with-date';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';
import { Theme } from '@/types/theme/theme';
import { useAccounts } from '@/use-cases/hooks/accounts/use-accounts';
import { useMultipleWatches } from '@/use-cases/hooks/use-multiple-watches';

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

  const {
    isLoading: isLoadingOld,
    data: oldData,
    errorSheetProps: oldErrorSheetProps,
  } = useDataFetchingErrorHandler(categoriesQuery, tagsQuery);

  const { data, isLoading, errors } = useMultipleWatches({
    accounts: () => accountsQuery,
  });

  if (isLoadingOld || !oldData || isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const [categories, tags] = oldData;
  const { accounts } = data;

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
