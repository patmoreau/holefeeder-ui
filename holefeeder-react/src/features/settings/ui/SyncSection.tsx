import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSyncInfo } from '@/features/settings/core/use-sync-info';
import { AppField } from '@/features/shared/ui/AppField';
import { AppSection } from '@/features/shared/ui/AppSection';
import { AppCollapsible } from '@/features/shared/ui/components/AppCollapsible';
import { AppSwitch } from '@/features/shared/ui/components/AppSwitch';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';
import { spacing, Theme } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  collapsibleSection: {
    flexGrow: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    ...theme.styles.containers.section,
    marginHorizontal: undefined,
  },
});

export function SyncSection() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const { connected, lastSyncedAt, dataFlowStatus, counts } = useSyncInfo();

  return (
    <AppCollapsible title={t(tk.settings.syncSection.title)} style={styles.collapsibleSection}>
      <AppSection style={styles.section}>
        <AppField label={t(tk.settings.syncSection.connected)} icon={AppIcons.connected}>
          <AppSwitch value={connected} readonly={true} />
        </AppField>
        <AppField label={t(tk.settings.syncSection.lastSync)} icon={AppIcons.sync}>
          <AppText>{lastSyncedAt ? lastSyncedAt.toLocaleString() : t(tk.settings.syncSection.never)}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.downloading)} icon={AppIcons.download}>
          <AppSwitch value={dataFlowStatus.downloading} readonly={true} />
        </AppField>
        <AppField label={t(tk.settings.syncSection.uploading)} icon={AppIcons.upload}>
          <AppSwitch value={dataFlowStatus.uploading} readonly={true} />
        </AppField>
      </AppSection>
      <AppSection title={t(tk.settings.syncSection.syncedData)} style={styles.section}>
        <AppField label={t(tk.settings.syncSection.accounts)} icon={AppIcons.accounts}>
          <AppText>{counts.accounts}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.cashflows)} icon={AppIcons.cashflow}>
          <AppText>{counts.cashflows}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.categories)} icon={AppIcons.category}>
          <AppText>{counts.categories}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.storeItems)} icon={AppIcons.storeItem}>
          <AppText>{counts.storeItems}</AppText>
        </AppField>
        <AppField label={t(tk.settings.syncSection.transactions)} icon={AppIcons.purchase}>
          <AppText>{counts.transactions}</AppText>
        </AppField>
      </AppSection>
    </AppCollapsible>
  );
}
