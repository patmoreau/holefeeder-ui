import { BudgetSection } from '@/features/settings/ui/BudgetSection';
import { DisplaySection } from '@/features/settings/ui/DisplaySection';
import { ProfileSection } from '@/features/settings/ui/ProfileSection';
import { SyncSection } from '@/features/settings/ui/SyncSection';
import { TestSection } from '@/features/settings/ui/TestSection';
import { AppForm } from '@/features/shared/ui/AppForm';

export const SettingsContent = () => {
  return (
    <AppForm>
      <ProfileSection />
      <BudgetSection />
      <DisplaySection />
      {__DEV__ && <TestSection />}
      <SyncSection />
    </AppForm>
  );
};
