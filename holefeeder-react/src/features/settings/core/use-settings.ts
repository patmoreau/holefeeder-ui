import { storeItemApi } from '@/features/settings/api/store-item-api';
import { DefaultSettings, fromJson, Settings } from '@/features/settings/core/settings';
import { createMutationHook } from '@/shared/hooks/queries/use-mutation';
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

  return {
    storeItemId: firstItem.id,
    ...settings.value,
  };
};

const settingsQuery = createSingletonQueryHook<Settings>('settings', fetchSettings);

const settingsMutation = createMutationHook<Settings>('settings', (data, token) => {
  console.log('settingsMutation:', data);
  const { storeItemId, ...settingsData } = data;
  const jsonData = JSON.stringify(settingsData);

  if (storeItemId === undefined) {
    return storeItemApi(token).create('settings', jsonData).then();
  } else {
    return storeItemApi(token).modify(storeItemId, jsonData).then();
  }
});

export const { useSingleton: useSettings, keys: settingsKeys } = settingsQuery;
export const { useCommand: useUpdateSettings } = settingsMutation;
