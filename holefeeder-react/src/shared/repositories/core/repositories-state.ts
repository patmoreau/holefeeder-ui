import { DashboardRepository } from '@/dashboard/core/dashboard-repository';
import { AccountsRepository } from '@/flows/core/accounts/accounts-repository';
import { CategoriesRepository } from '@/flows/core/categories/categories-repository';
import { FlowsRepository } from '@/flows/core/flows/flows-repository';
import { SettingRepository } from '@/settings/core/setting-repository';
import { StoreItemsRepository } from '@/shared/core/store-items-repository';

export type RepositoriesState = {
  accountRepository: AccountsRepository;
  categoryRepository: CategoriesRepository;
  dashboardRepository: DashboardRepository;
  flowRepository: FlowsRepository;
  settingRepository: SettingRepository;
  storeItemRepository: StoreItemsRepository;
};
