import React from 'react';
import { SyncSettingsContent } from '@/settings/ui/SyncSettingsContent';
import { AppScreen } from '@/shared/presentation/AppScreen';

const SyncSettingsScreen = () => {
  return (
    <AppScreen>
      <SyncSettingsContent />
    </AppScreen>
  );
};

export default SyncSettingsScreen;
