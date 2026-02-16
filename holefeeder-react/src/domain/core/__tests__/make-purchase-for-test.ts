import { aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId, aString, aWord } from '@/__tests__/mocks/string-for-test';
import { DateIntervalType, DateIntervalTypes } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { TagList } from '@/domain/core/flows/tag-list';

const defaultCreateFlowCommand = (
  overrides?: Partial<{
    effectiveDate: DateOnly;
    intervalType: DateIntervalType;
    frequency: number;
    recurrence: number;
  }>
): CreateFlowCommand => ({
  date: aRecentDate(),
  amount: anAmount(),
  description: aString(),
  accountId: anId(),
  categoryId: anId(),
  tags: TagList.valid([aWord(), aWord()]),
  cashflow: overrides
    ? {
        effectiveDate: aRecentDate(),
        intervalType: DateIntervalTypes.monthly,
        frequency: 1,
        recurrence: 1,
        ...overrides,
      }
    : undefined,
});

type CreateFlowCommandOverrides = Omit<Partial<CreateFlowCommand>, 'cashflow'> & {
  cashflow?: Partial<NonNullable<CreateFlowCommand['cashflow']>>;
};

export const aCreateFlowCommand = (overrides?: CreateFlowCommandOverrides): CreateFlowCommand => {
  const { cashflow, ...rest } = overrides || {};
  return {
    ...defaultCreateFlowCommand(cashflow),
    ...rest,
  };
};
