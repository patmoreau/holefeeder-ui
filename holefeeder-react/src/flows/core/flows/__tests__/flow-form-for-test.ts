import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString, aWord } from '@/__tests__/mocks/string-for-test';

type FlowForm = {
  id: string;
  date: string;
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  tags: string[];
};

const defaultFlowForm = (): FlowForm => ({
  id: anId(),
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  tags: [aWord(), aWord()],
});

export const aFlowForm = (overrides?: Partial<FlowForm>): FlowForm => {
  return {
    ...defaultFlowForm(),
    ...overrides,
  };
};
