import { usePowerSync } from '@powersync/react';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AccountsRepository } from '@/domain/core/accounts/accounts-repository';
import { CategoriesRepository } from '@/domain/core/categories/categories-repository';
import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { AccountsRepositoryInPowersync } from '@/domain/persistence/accounts/accounts-repository-in-powersync';
import { CategoriesRepositoryInPowersync } from '@/domain/persistence/categories/categories-repository-in-powersync';
import { DashboardRepositoryInPowersync } from '@/domain/persistence/dashboard/dashboard-repository-in-powersync';
import { FlowsRepositoryInPowersync } from '@/domain/persistence/flows/flows-repository-in-powersync';
import { SettingsRepository } from '@/settings/core/settings-repository';
import { SettingsRepositoryInPowersync } from '@/settings/persistence/settings-repository-in-powersync';
import { StoreItemsRepository } from '@/shared/core/store-items-repository';
import { StoreItemsRepositoryInPowersync } from '@/shared/persistence/store-items-repository-in-powersync';

export type Repositories = {
  accountRepository: AccountsRepository;
  categoryRepository: CategoriesRepository;
  dashboardRepository: DashboardRepository;
  flowRepository: FlowsRepository;
  settingsRepository: SettingsRepository;
  storeItemRepository: StoreItemsRepository;
};

export const RepositoryContext = createContext<Repositories | null>(null);

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
  const db = usePowerSync();

  const repositories = useMemo<Repositories>(
    () => ({
      accountRepository: AccountsRepositoryInPowersync(db),
      categoryRepository: CategoriesRepositoryInPowersync(db),
      dashboardRepository: DashboardRepositoryInPowersync(db),
      flowRepository: FlowsRepositoryInPowersync(db),
      settingsRepository: SettingsRepositoryInPowersync(db),
      storeItemRepository: StoreItemsRepositoryInPowersync(db),
    }),
    [db]
  );

  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
};

export const useRepositories = (): Repositories => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
};
