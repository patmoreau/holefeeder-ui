import { faker } from '@faker-js/faker';
import { CategoryType } from '@/shared/core/category-type';
import { DateIntervalType, DateIntervalTypes } from '@/shared/core/date-interval-type';
import { AccountType, AccountTypes } from '@/use-cases/core/accounts/account-type';

export const anAccountType = (): AccountType => faker.helpers.arrayElement(Object.values(AccountTypes)) as AccountType;

export const aCategoryType = (): CategoryType => faker.helpers.arrayElement(Object.values(CategoryType)) as CategoryType;

export const aDateIntervalType = (): DateIntervalType => faker.helpers.arrayElement(Object.values(DateIntervalTypes)) as DateIntervalType;
