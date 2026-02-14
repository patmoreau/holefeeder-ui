import React from 'react';
import { SettingsFormData } from '@/features/settings/core/settings-form-data';
import { SettingsFormProvider, validateSettingsForm } from '@/features/settings/core/use-settings-form';
import { BudgetSettingsForm } from '@/features/settings/ui/BudgetSettingsForm';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useSettings } from '@/presentation/hooks/store-items/use-settings';
import { useMultipleWatches } from '@/presentation/hooks/use-multiple-watches';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
});

const BudgetSettingsScreen = () => {
  const settingsQuery = useSettings();
  const styles = useStyles(createStyles);

  const { data, isLoading, errors } = useMultipleWatches({
    settings: () => settingsQuery,
  });

  if (isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { settings } = data;

  const initialData: SettingsFormData = {
    effectiveDate: settings.effectiveDate,
    frequency: settings.frequency,
    intervalType: settings.intervalType,
  };

  return (
    <AppScreen>
      <SettingsFormProvider initialValue={initialData} validate={validateSettingsForm} validateOnChange>
        <BudgetSettingsForm />
      </SettingsFormProvider>
      <ErrorSheet {...errors} />
    </AppScreen>
  );
};

export default BudgetSettingsScreen;
