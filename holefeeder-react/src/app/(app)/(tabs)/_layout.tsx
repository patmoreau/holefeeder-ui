import React from 'react';

import { Icon, NativeTabs, Label } from 'expo-router/unstable-native-tabs';
import { useLanguage } from '@/hooks';

export default function TabLayout() {
  const { t, currentLanguage } = useLanguage();

  return (
    <NativeTabs key={currentLanguage}>
      <NativeTabs.Trigger name="index">
        <Icon sf="rectangle.3.group.fill" />
        <Label>{t('tabs.dashboard')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <Icon sf="wallet.bifold.fill" />
        <Label>{t('tabs.accounts')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" />
        <Label>{t('tabs.settings')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
