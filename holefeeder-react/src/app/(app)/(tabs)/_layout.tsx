import { Icon, NativeTabs, Label } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLanguage } from '@/shared/hooks/use-language';

export default function TabsLayout() {
  const { t, currentLanguage } = useLanguage();
  const { theme } = useTheme();

  return (
    <NativeTabs key={currentLanguage} iconColor={theme.colors.tabIconDefault} tintColor={theme.colors.tabIconSelected}>
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
