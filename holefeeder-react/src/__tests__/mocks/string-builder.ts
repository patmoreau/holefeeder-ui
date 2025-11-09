import { faker } from '@faker-js/faker';
import { Id } from '@/features/purchase/core/id';

export const aColor = () => faker.color.rgb();

export const anId = () => faker.string.uuid() as Id;

export const aString = () => faker.lorem.words(3);
