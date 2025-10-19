import { faker } from '@faker-js/faker';

export const aColor = () => faker.color.rgb();

export const anId = () => faker.string.uuid();

export const aString = () => faker.lorem.words(3);
