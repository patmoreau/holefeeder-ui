import React from 'react';
import { useTranslation } from 'react-i18next';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SettingsContent } from '@/features/settings/ui/SettingsContent';
import { ScreenTitle } from '@/features/shared/ui/components/ScreenTitle';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';

const useComponentStyles = () =>
  useStyles((_) => ({
    container: {
      flex: 1,
      minHeight: '100%',
    },
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
  }));

const SettingsScreen = () => {
  const { t } = useTranslation();
  const styles = useComponentStyles();

  return (
    <ParallaxScrollView
      style={styles.container}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<IconSymbol size={310} color="#808080" name="gearshape" style={styles.headerImage} />}
    >
      <ScreenTitle title={t(tk.settings.title)} />
      <SettingsContent />
    </ParallaxScrollView>
  );
};

export default SettingsScreen;
