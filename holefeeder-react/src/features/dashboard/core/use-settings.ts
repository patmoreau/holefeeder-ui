import { useMemo } from 'react';
import { DefaultSettings, fromJson } from '@/features/dashboard/core/settings';
import { useStoreItems } from '@/features/dashboard/core/use-store-items';

export const useSettings = () => {
  const storeItemsQuery = useStoreItems({ filter: { code: 'settings' } });

  const mappedSettings = useMemo(() => {
    const firstItem = storeItemsQuery.data?.[0];
    if (!firstItem) return DefaultSettings;

    const settings = fromJson(firstItem.data);

    if (settings.isFailure) {
      return DefaultSettings;
    }

    return settings.value;
  }, [storeItemsQuery.data]);

  return {
    // Return the mapped data along with query state
    data: mappedSettings,
    isLoading: storeItemsQuery.isLoading,
    isError: storeItemsQuery.isError,
    error: storeItemsQuery.error,
  };
};
