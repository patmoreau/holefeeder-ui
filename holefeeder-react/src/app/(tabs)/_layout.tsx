import React from 'react';

import { Icon, NativeTabs, Label } from 'expo-router/unstable-native-tabs';
import { useLanguage } from '@/contexts';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" drawable="custom_android_drawable" />
        <Label>{t('tabs.home')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf="paperplane.fill" drawable="custom_settings_drawable" />
        <Label>{t('tabs.explore')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" drawable="" />
        <Label>{t('tabs.profile')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" drawable="custom_settings_drawable" />
        <Label>{t('tabs.settings')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="test">
        <Icon sf="testtube.2" drawable="custom_settings_drawable" />
        <Label>{t('tabs.test')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
