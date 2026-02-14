import { faker } from '@faker-js/faker';
import { AccountType, AccountTypes } from '@/domain/core/accounts/account-type';
import { CategoryType, CategoryTypes } from '@/domain/core/categories/category-type';
import { DateIntervalType, DateIntervalTypes } from '@/domain/core/date-interval-type';

export const anAccountType = (): AccountType => faker.helpers.arrayElement(Object.values(AccountTypes)) as AccountType;

export const aCategoryType = (): CategoryType => faker.helpers.arrayElement(Object.values(CategoryTypes)) as CategoryType;

export const aDateIntervalType = (): DateIntervalType => faker.helpers.arrayElement(Object.values(DateIntervalTypes)) as DateIntervalType;
