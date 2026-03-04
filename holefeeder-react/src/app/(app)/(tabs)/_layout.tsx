import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLanguage } from '@/shared/hooks/use-language';
import { AppIcons } from '@/types/icons';

const TabsLayout = () => {
  const { t, currentLanguage } = useLanguage();
  const { theme } = useTheme();

  return (
    <NativeTabs key={currentLanguage} iconColor={theme.colors.tabIconDefault} tintColor={theme.colors.tabIconSelected}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={AppIcons.dashboard} />
        <NativeTabs.Trigger.Label>{t(tk.tabs.dashboard)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <NativeTabs.Trigger.Icon sf={AppIcons.accounts} />
        <NativeTabs.Trigger.Label>{t(tk.tabs.accounts)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf={AppIcons.settings} />
        <NativeTabs.Trigger.Label>{t(tk.tabs.settings)}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
