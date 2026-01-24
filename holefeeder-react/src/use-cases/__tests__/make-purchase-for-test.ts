import { aRecentDate } from '@/__tests__/mocks/date-builder';
import { anAmount } from '@/__tests__/mocks/number-builder';
import { anId, aString, aWord } from '@/__tests__/mocks/string-builder';
import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { TagList } from '@/use-cases/core/flows/tag-list';

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
        intervalType: DateIntervalType.monthly,
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
