import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString } from '@/__tests__/mocks/string-for-test';
import { TransferFlowCommand } from '@/flows/core/flows/transfer/transfer-flow-command';

const defaultTransferFlowCommand = (): TransferFlowCommand => ({
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  sourceAccountId: anId(),
  targetAccountId: anId(),
});

export const aTransferFlowCommand = (overrides?: Partial<TransferFlowCommand>): TransferFlowCommand => ({
  ...defaultTransferFlowCommand(),
  ...overrides,
});
