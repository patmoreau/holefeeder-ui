import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppSection } from '@/features/shared/ui/AppSection';
import { AppView } from '@/features/shared/ui/AppView';
import { AppCollapsible } from '@/features/shared/ui/components/AppCollapsible';
import { AppSwitch } from '@/features/shared/ui/components/AppSwitch';
import { AppText } from '@/features/shared/ui/components/AppText';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { tk } from '@/i18n/translations';
import { DEFAULT_SYNC_INFO } from '@/presentation/hooks/settings/sync-info';
import { useSyncInfo } from '@/presentation/hooks/settings/use-sync-info';
import { useMultipleWatches, withDefault } from '@/presentation/hooks/use-multiple-watches';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';
import { spacing, Theme } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  collapsibleSection: {
    flexGrow: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  container: {
    ...theme.styles.containers.center,
  },
  section: {
    ...theme.styles.containers.section,
    marginHorizontal: undefined,
  },
});

export function SyncSection() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const syncInfoQuery = useSyncInfo();

  const { data, isLoading, errors } = useMultipleWatches({
    syncInfo: withDefault(() => syncInfoQuery, DEFAULT_SYNC_INFO),
  });

  if (isLoading || !data) {
    return (
      <AppView style={styles.container}>
        <LoadingIndicator />
        <ErrorSheet {...errors} />
      </AppView>
    );
  }

  const { syncInfo } = data;

  return (
    <AppCollapsible title={t(tk.settings.syncSection.title)} style={styles.collapsibleSection}>
      <AppSection style={styles.section}>
        <AppField label={t(tk.settings.syncSection.connected)} icon={AppIcons.connected}>
          <AppSwitch value={syncInfo.connected} readonly={true} />
        </AppField>
        <AppField label={t(tk.settings.syncSection.lastSync)} icon={AppIcons.sync}>
          <AppText>{syncInfo.lastSyncedAt ? syncInfo.lastSyncedAt.toLocaleString() : t(tk.settings.syncSection.never)}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.downloading)} icon={AppIcons.download}>
          <AppSwitch value={syncInfo.dataFlowStatus.downloading} readonly={true} />
        </AppField>
        <AppField label={t(tk.settings.syncSection.uploading)} icon={AppIcons.upload}>
          <AppSwitch value={syncInfo.dataFlowStatus.uploading} readonly={true} />
        </AppField>
        <AppField label={t(tk.settings.syncSection.outstanding)} icon={AppIcons.uploadOutstanding}>
          <AppText>{syncInfo.dataMetrics.outstandingTransactions}</AppText>
        </AppField>
      </AppSection>
      <AppSection title={t(tk.settings.syncSection.syncedData)} style={styles.section}>
        <AppField label={t(tk.settings.syncSection.accounts)} icon={AppIcons.accounts}>
          <AppText>{syncInfo.dataMetrics.accounts}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.cashflows)} icon={AppIcons.cashflow}>
          <AppText>{syncInfo.dataMetrics.cashflows}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.categories)} icon={AppIcons.category}>
          <AppText>{syncInfo.dataMetrics.categories}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.storeItems)} icon={AppIcons.storeItem}>
          <AppText>{syncInfo.dataMetrics.storeItems}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.transactions)} icon={AppIcons.purchase}>
          <AppText>{syncInfo.dataMetrics.transactions}</AppText>
        </AppField>
      </AppSection>
    </AppCollapsible>
  );
}
