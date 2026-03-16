import { aFutureDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString } from '@/__tests__/mocks/string-for-test';
import { aTagList } from '@/domain/core/__tests__/tag-list-for-test';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';

const defaultUpcomingFlow = (): UpcomingFlow => ({
  id: anId(),
  date: aFutureDate(),
  amount: anAmount(),
  description: aString(),
  tags: aTagList(),
});

export const aUpcomingFlow = (overrides?: Partial<UpcomingFlow>): UpcomingFlow => ({
  ...defaultUpcomingFlow(),
  ...overrides,
});
