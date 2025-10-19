import * as QuickActions from 'expo-quick-actions';
import type { RouterAction } from 'expo-quick-actions/router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useLanguage } from '@/shared/hooks/use-language';

export function useQuickActions() {
  const { t } = useLanguage();

  useEffect(() => {
    QuickActions.setItems<RouterAction<'/purchase' | '/help'>>([
      {
        title: t('quick-actions.purchase-title'),
        icon: Platform.OS === 'ios' ? 'symbol:cart.fill.badge.plus' : undefined,
        id: '0',
        params: { href: '/purchase' },
      },
      {
        title: t('quick-actions.help-title'),
        subtitle: t('quick-actions.help-subtitle'),
        icon: Platform.OS === 'ios' ? 'symbol:person.crop.circle.badge.questionmark' : undefined,
        id: '1',
        params: { href: '/help' },
      },
    ]).then(() => {
      console.debug('Quick actions set');
    });
  }, [t]);
}
