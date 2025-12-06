import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
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
        <Icon sf={AppIcons.dashboard} />
        <Label>{t(tk.tabs.dashboard)}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <Icon sf={AppIcons.accounts} />
        <Label>{t(tk.tabs.accounts)}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={AppIcons.settings} />
        <Label>{t(tk.tabs.settings)}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
