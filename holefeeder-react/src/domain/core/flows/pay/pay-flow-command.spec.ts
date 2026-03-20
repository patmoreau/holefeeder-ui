import { aPastDate, aRecentDate } from '@/__tests__/mocks/date-for-test';
import { anAmount } from '@/__tests__/mocks/number-for-test';
import { anId } from '@/__tests__/mocks/string-for-test';
import { PayFlowCommand } from '@/domain/core/flows/pay/pay-flow-command';
import { DateOnly, DateOnlyErrors } from '@/shared/core/date-only';
import { Id, IdErrors } from '@/shared/core/id';
import { Money, MoneyErrors } from '@/shared/core/money';

describe('PayFlowCommand', () => {
  let form: Record<string, unknown>;

  beforeEach(() => {
    form = {
      date: aRecentDate(),
      amount: anAmount(),
      cashflowId: anId(),
      cashflowDate: aPastDate(),
    };
  });

  it('succeeds with valid data', () => {
    const result = PayFlowCommand.create(form);
    expect(result).toBeSuccessWithValue({
      date: DateOnly.valid(form.date),
      amount: Money.valid(form.amount),
      cashflowId: Id.valid(form.cashflowId),
      cashflowDate: DateOnly.valid(form.cashflowDate),
    });
  });

  it('returns failure if date is invalid', () => {
    form.date = 'invalid-date';
    const result = PayFlowCommand.create(form);
    expect(result).toBeFailureWithErrors([DateOnlyErrors.invalid]);
  });

  it('returns failure if amount is invalid', () => {
    form.amount = NaN;
    const result = PayFlowCommand.create(form);
    expect(result).toBeFailureWithErrors([MoneyErrors.invalid]);
  });

  it('returns failure if cashflowId is invalid', () => {
    form.cashflowId = '';
    const result = PayFlowCommand.create(form);
    expect(result).toBeFailureWithErrors([IdErrors.invalid]);
  });

  it('returns failure if cashflowDate is invalid', () => {
    form.cashflowDate = 'invalid-date';
    const result = PayFlowCommand.create(form);
    expect(result).toBeFailureWithErrors([DateOnlyErrors.invalid]);
  });
});
