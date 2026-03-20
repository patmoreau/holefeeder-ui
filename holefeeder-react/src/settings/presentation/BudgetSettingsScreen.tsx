import React from 'react';
import { useMultipleWatches, withDefault } from '@/features/shared/core/use-multiple-watches';
import { useSettings } from '@/features/shared/core/use-settings';
import { AppScreen } from '@/features/shared/ui/AppScreen';
import { AppView } from '@/features/shared/ui/AppView';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { DefaultSettings } from '@/settings/core/settings';
import { SettingsFormData } from '@/settings/core/settings-form-data';
import { BudgetSettingsForm } from '@/settings/presentation/BudgetSettingsForm';
import { SettingsFormProvider, validateSettingsForm } from '@/settings/presentation/core/use-settings-form';
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
    settings: withDefault(() => settingsQuery, DefaultSettings),
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
