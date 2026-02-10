import { usePowerSync } from '@powersync/react-native';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AccountsRepository } from '@/use-cases/core/accounts/accounts-repository';
import { CategoriesRepository } from '@/use-cases/core/categories/categories-repository';
import { DashboardRepository } from '@/use-cases/core/dashboard/dashboard-repository';
import { FlowsRepository } from '@/use-cases/core/flows/flows-repository';
import { StoreItemsRepository } from '@/use-cases/core/store-items/store-items-repository';
import { AccountsRepositoryInPowersync } from '@/use-cases/persistence/accounts-repository-in-powersync';
import { CategoriesRepositoryInPowersync } from '@/use-cases/persistence/categories-repository-in-powersync';
import { DashboardRepositoryInPowersync } from '@/use-cases/persistence/dashboard-repository-in-powersync';
import { FlowsRepositoryInPowersync } from '@/use-cases/persistence/flows-repository-in-powersync';
import { StoreItemsRepositoryInPowersync } from '@/use-cases/persistence/store-items-repository-in-powersync';

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
