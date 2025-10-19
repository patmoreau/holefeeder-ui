import { faker } from '@faker-js/faker';
import { AccountType } from '@/features/purchase/core/account';

export const anAccountType = (): AccountType => faker.helpers.arrayElement(Object.values(AccountType)) as AccountType;
