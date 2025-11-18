import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { tk } from '@/i18n/translations';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLanguage } from '@/shared/hooks/use-language';

const TabsLayout = () => {
  const { t, currentLanguage } = useLanguage();
  const { theme } = useTheme();

  return (
    <NativeTabs key={currentLanguage} iconColor={theme.colors.tabIconDefault} tintColor={theme.colors.tabIconSelected}>
      <NativeTabs.Trigger name="index">
        <Icon sf="rectangle.3.group.fill" />
        <Label>{t(tk.tabs.dashboard)}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="accounts">
        <Icon sf="wallet.bifold.fill" />
        <Label>{t(tk.tabs.accounts)}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" />
        <Label>{t(tk.tabs.settings)}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabsLayout;
