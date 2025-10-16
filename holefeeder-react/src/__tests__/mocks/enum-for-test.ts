import { faker } from '@faker-js/faker';
import { AccountType } from '@/core';

export const anAccountType = (): AccountType => faker.helpers.arrayElement(Object.values(AccountType)) as AccountType;
