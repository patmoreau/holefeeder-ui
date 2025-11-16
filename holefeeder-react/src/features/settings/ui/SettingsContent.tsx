import { Form, Host } from '@expo/ui/swift-ui';
import { DisplaySection } from '@/features/settings/ui/display-section';
import { ProfileSection } from '@/features/settings/ui/profile-section';
import { TestSection } from '@/features/settings/ui/test-section';

export const SettingsContent = () => {
  return (
    <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
      <Form>
        <ProfileSection />
        <DisplaySection />
        {__DEV__ && <TestSection />}
      </Form>
    </Host>
  );
};
