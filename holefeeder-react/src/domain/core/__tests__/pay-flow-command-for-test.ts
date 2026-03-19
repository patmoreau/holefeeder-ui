import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId } from '@/__tests__/mocks/string-for-test';
import { PayFlowCommand } from '@/domain/core/flows/pay/pay-flow-command';

const defaultPayFlowCommand = (): PayFlowCommand => ({
  date: aRecentDate(),
  amount: anAmount(),
  cashflowId: anId(),
  cashflowDate: aRecentDate(),
});

export const aPayFlowCommand = (overrides?: Partial<PayFlowCommand>): PayFlowCommand => {
  return {
    ...defaultPayFlowCommand(),
    ...overrides,
  };
};
