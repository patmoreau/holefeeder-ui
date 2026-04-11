import { BudgetSection } from '@/settings/ui/BudgetSection';
import { DisplaySection } from '@/settings/ui/DisplaySection';
import { ProfileSection } from '@/settings/ui/ProfileSection';
import { SyncSection } from '@/settings/ui/SyncSection';
import { TestSection } from '@/settings/ui/TestSection';
import { AppForm } from '@/shared/presentation/AppForm';

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
