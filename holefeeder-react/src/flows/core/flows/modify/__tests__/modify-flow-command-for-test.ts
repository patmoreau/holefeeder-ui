import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString, aWord } from '@/__tests__/mocks/string-for-test';
import { ModifyFlowCommand } from '@/flows/core/flows/modify/modify-flow-command';
import { TagList } from '@/flows/core/flows/tag-list';

const defaultModifyFlowCommand = (): ModifyFlowCommand => ({
  id: anId(),
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  tags: TagList.valid([aWord(), aWord()]),
});

export const aModifyFlowCommand = (overrides?: Partial<ModifyFlowCommand>): ModifyFlowCommand => {
  return {
    ...defaultModifyFlowCommand(),
    ...overrides,
  };
};
