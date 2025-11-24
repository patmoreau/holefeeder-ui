import { DisplaySection } from '@/features/settings/ui/DisplaySection';
import { ProfileSection } from '@/features/settings/ui/ProfileSection';
import { TestSection } from '@/features/settings/ui/TestSection';
import { Form } from '@/features/shared/ui/Form';

export const SettingsContent = () => {
  return (
    <Form>
      <ProfileSection />
      <DisplaySection />
      {__DEV__ && <TestSection />}
    </Form>
  );
};
