import { Form, Host } from '@expo/ui/swift-ui';
import { DisplaySection } from '@/features/settings/ui/display-section';
import { ProfileSection } from '@/features/settings/ui/profile-section';

export const SettingsContent = () => {
  return (
    <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
      <Form>
        <ProfileSection />
        <DisplaySection />
      </Form>
    </Host>
  );
};
