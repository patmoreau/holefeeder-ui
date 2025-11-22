import * as QuickActions from 'expo-quick-actions';
import { useQuickActionCallback } from 'expo-quick-actions/hooks';
import type { RouterAction } from 'expo-quick-actions/router';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { tk } from '@/i18n/translations';
import { useLanguage } from '@/shared/hooks/use-language';

const routerInitializationDelay = 100;

type AvailableQuickActions = '/(app)/purchase' | '/help';

const isValidQuickActionHref = (href: unknown): href is AvailableQuickActions => {
  return href === '/(app)/purchase' || href === '/help';
};

export function useQuickActions() {
  const { t } = useLanguage();

  const handleQuickAction = useCallback((action: QuickActions.Action) => {
    console.debug('[Quick actions] Callback invoked:', JSON.stringify(action, null, 2));

    if (action?.params?.href) {
      const href = action.params.href;

      if (isValidQuickActionHref(href)) {
        console.debug('[Quick actions] Navigating to:', href);

        setTimeout(() => {
          router.push(href);
        }, routerInitializationDelay);
      } else {
        console.warn('[Quick actions] Invalid href:', href);
      }
    } else {
      console.warn('[Quick actions] No href found in action params');
    }
  }, []);

  useQuickActionCallback(handleQuickAction);

  useEffect(() => {
    console.debug('[Quick actions] Setting up event listener');
    const subscription = QuickActions.addListener((event) => {
      console.debug('[Quick actions] Event fired:', JSON.stringify(event, null, 2));
    });

    return () => {
      console.debug('[Quick actions] Cleaning up event listener');
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const setupQuickActions = async () => {
      try {
        await QuickActions.setItems<RouterAction<AvailableQuickActions>>([
          {
            title: t(tk.quickActions.purchaseTitle),
            icon: Platform.OS === 'ios' ? 'symbol:cart.fill.badge.plus' : undefined,
            id: '0',
            params: { href: '/(app)/purchase' },
          },
          {
            title: t(tk.quickActions.helpTitle),
            subtitle: t(tk.quickActions.helpSubtitle),
            icon: Platform.OS === 'ios' ? 'symbol:person.crop.circle.badge.questionmark' : undefined,
            id: '1',
            params: { href: '/help' },
          },
        ]);
        console.debug('[Quick actions] Items set successfully');
      } catch (error) {
        console.error('[Quick actions] Setup error:', error);
      }
    };

    setupQuickActions()
      .then(() => console.debug('[Quick actions] Setup complete'))
      .catch((error) => console.error('[Quick actions] Setup failed:', error));
  }, [t]);
}
