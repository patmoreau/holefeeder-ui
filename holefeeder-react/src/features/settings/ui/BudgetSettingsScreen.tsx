import React from 'react';
import { SettingsFormData } from '@/features/settings/core/settings-form-data';
import { useSettings } from '@/features/settings/core/use-settings';
import { SettingsFormProvider, validateSettingsForm } from '@/features/settings/core/use-settings-form';
import { BudgetSettingsForm } from '@/features/settings/ui/BudgetSettingsForm';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useDataFetchingErrorHandler } from '@/shared/hooks/use-data-fetching-error-handler';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
});

const BudgetSettingsScreen = () => {
  const settingsQuery = useSettings();
  const styles = useStyles(createStyles);

  const { isLoading, data, errorSheetProps } = useDataFetchingErrorHandler(settingsQuery);

  if (isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errorSheetProps} />
      </AppView>
    );
  }

  const initialData: SettingsFormData = {
    storeItemId: data.storeItemId,
    effectiveDate: data.effectiveDate,
    frequency: data.frequency,
    intervalType: data.intervalType,
  };

  return (
    <AppScreen>
      <SettingsFormProvider initialValue={initialData} validate={validateSettingsForm} validateOnChange>
        <BudgetSettingsForm />
      </SettingsFormProvider>
      <ErrorSheet {...errorSheetProps} />
    </AppScreen>
  );
};

export default BudgetSettingsScreen;
