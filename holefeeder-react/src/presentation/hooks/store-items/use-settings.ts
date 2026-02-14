import { useEffect, useMemo, useState } from 'react';
import { useRepositories } from '@/contexts/RepositoryContext';
import { Result } from '@/domain/core/result';
import { GetSettingsUseCase } from '@/domain/core/store-items/get-settings/get-settings-use-case';
import type { Settings } from '@/domain/core/store-items/settings';

export const useSettings = (): Result<Settings> => {
  const { storeItemRepository } = useRepositories();
  const [settings, setSettings] = useState<Result<Settings>>(Result.loading());

  const useCase = useMemo(() => GetSettingsUseCase(storeItemRepository), [storeItemRepository]);

  useEffect(() => {
    const unsubscribe = useCase.query(setSettings);
    return () => unsubscribe();
  }, [useCase]);

  return settings;
};
