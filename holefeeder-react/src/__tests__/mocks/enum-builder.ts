import { faker } from '@faker-js/faker';
import { CategoryType } from '@/core/category-type';
import { AccountType } from '@/features/shared/core/account-type';
import { DateIntervalType } from '@/features/shared/core/date-interval-type';

export const anAccountType = (): AccountType => faker.helpers.arrayElement(Object.values(AccountType)) as AccountType;

export const aCategoryType = (): CategoryType => faker.helpers.arrayElement(Object.values(CategoryType)) as CategoryType;

export const aDateIntervalType = (): DateIntervalType => faker.helpers.arrayElement(Object.values(DateIntervalType)) as DateIntervalType;
