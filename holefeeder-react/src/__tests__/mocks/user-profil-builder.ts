import { UserProfile } from '@/types/user-profile';

const defaultData = (): UserProfile => ({
  name: 'Mock User',
  username: 'mock-username',
  email: 'mock-email@example.com',
  avatar: 'mock-avatar-url',
});

export const aUserProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  ...defaultData(),
  ...overrides,
});
