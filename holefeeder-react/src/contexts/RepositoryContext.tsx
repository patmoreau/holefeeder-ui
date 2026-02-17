import { usePowerSync } from '@powersync/react';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AccountsRepository } from '@/domain/core/accounts/accounts-repository';
import { CategoriesRepository } from '@/domain/core/categories/categories-repository';
import { DashboardRepository } from '@/domain/core/dashboard/dashboard-repository';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { StoreItemsRepository } from '@/domain/core/store-items/store-items-repository';
import { AccountsRepositoryInPowersync } from '@/domain/persistence/accounts/accounts-repository-in-powersync';
import { CategoriesRepositoryInPowersync } from '@/domain/persistence/categories/categories-repository-in-powersync';
import { DashboardRepositoryInPowersync } from '@/domain/persistence/dashboard/dashboard-repository-in-powersync';
import { FlowsRepositoryInPowersync } from '@/domain/persistence/flows/flows-repository-in-powersync';
import { StoreItemsRepositoryInPowersync } from '@/domain/persistence/store-items/store-items-repository-in-powersync';

export type Repositories = {
  accountRepository: AccountsRepository;
  categoryRepository: CategoriesRepository;
  dashboardRepository: DashboardRepository;
  flowRepository: FlowsRepository;
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
