import { usePowerSync } from '@powersync/react';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { DashboardRepository } from '@/dashboard/core/dashboard-repository';
import { DashboardRepositoryInPowersync } from '@/dashboard/persistence/dashboard-repository-in-powersync';
import { AccountsRepository } from '@/flows/core/accounts/accounts-repository';
import { CategoriesRepository } from '@/flows/core/categories/categories-repository';
import { FlowsRepository } from '@/flows/core/flows/flows-repository';
import { AccountsRepositoryInPowersync } from '@/flows/persistence/accounts-repository-in-powersync';
import { CategoriesRepositoryInPowersync } from '@/flows/persistence/categories-repository-in-powersync';
import { FlowsRepositoryInPowersync } from '@/flows/persistence/flows-repository-in-powersync';
import { SettingRepository } from '@/settings/core/setting-repository';
import { SettingRepositoryInPowersync } from '@/settings/persistence/setting-repository-in-powersync';
import { StoreItemsRepository } from '@/shared/core/store-items-repository';
import { StoreItemsRepositoryInPowersync } from '@/shared/persistence/store-items-repository-in-powersync';

export type Repositories = {
  accountRepository: AccountsRepository;
  categoryRepository: CategoriesRepository;
  dashboardRepository: DashboardRepository;
  flowRepository: FlowsRepository;
  settingRepository: SettingRepository;
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
      settingRepository: SettingRepositoryInPowersync(db),
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
