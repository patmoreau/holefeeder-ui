import { usePowerSync } from '@powersync/react-native';
import { useEffect, useState, useMemo } from 'react';
import { Result } from '@/shared/core/result';
import { GetSettingsUseCase } from '@/use-cases/core/store-items/get-settings/get-settings-use-case';
import type { Settings } from '@/use-cases/core/store-items/settings';
import { StoreItemsRepositoryInPowersync } from '@/use-cases/persistence/store-items-repository-in-powersync';

export const useSettings = (): Result<Settings> => {
  const db = usePowerSync();
  const [settings, setSettings] = useState<Result<Settings>>(Result.loading());

  const useCase = useMemo(() => GetSettingsUseCase(StoreItemsRepositoryInPowersync(db)), [db]);

  useEffect(() => {
    const unsubscribe = useCase.query(setSettings);
    return () => unsubscribe();
  }, [useCase]);

  return settings;
};
