import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsContent } from '@/features/settings/ui/SettingsContent';
import { ScreenTitle } from '@/features/shared/ui/components/ScreenTitle';
import { ParallaxScrollView } from '@/features/shared/ui/ParallaxScrollView';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    minHeight: '100%' as const,
    backgroundColor: 'red',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute' as const,
  },
});

const SettingsScreen = () => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { theme } = useTheme();

  return (
    <ParallaxScrollView
      style={styles.content}
      headerBackgroundColor={theme.colors.settings}
      headerImage={<IconSymbol size={310} color="#808080" name="gearshape" style={styles.headerImage} />}
    >
      <ScreenTitle title={t(tk.settings.title)} />
      <SettingsContent />
    </ParallaxScrollView>
  );
};

export default SettingsScreen;
