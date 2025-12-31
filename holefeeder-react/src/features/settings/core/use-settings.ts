import { storeItemApi } from '@/features/settings/api/store-item-api';
import { DefaultSettings, fromJson, Settings } from '@/features/settings/core/settings';
import { createSingletonQueryHook } from '@/shared/hooks/queries/use-query';

const fetchSettings = async (token: string | null): Promise<Settings> => {
  const result = await storeItemApi(token)
    .query({ filter: { code: 'settings' }, limit: 1 })
    .then((r) => r.data);

  const firstItem = result?.[0];
  if (!firstItem) return DefaultSettings;

  const settings = fromJson(firstItem.data);

  if (settings.isFailure) {
    return DefaultSettings;
  }

  return settings.value;
};

const settingsQuery = createSingletonQueryHook<Settings>('settings', fetchSettings);

export const { useSingleton: useSettings, keys: settingsKeys } = settingsQuery;
