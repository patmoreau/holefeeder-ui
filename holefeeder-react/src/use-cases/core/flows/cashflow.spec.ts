import { aBoolean } from '@/__tests__/mocks/boolean-builder';
import { aRecentDate } from '@/__tests__/mocks/date-builder';
import { aDateIntervalType } from '@/__tests__/mocks/enum-builder';
import { aCount, anAmount } from '@/__tests__/mocks/number-builder';
import { anId, aString } from '@/__tests__/mocks/string-builder';
import { aTagList } from '@/use-cases/__tests__/tag-list-for-test';
import { Cashflow, CashflowErrors } from './cashflow';

describe('Cashflow', () => {
  const id = anId();
  const effectiveDate = aRecentDate();
  const amount = anAmount();
  const intervalType = aDateIntervalType();
  const frequency = aCount() + 1;
  const recurrence = aCount();
  const description = aString();
  const accountId = anId();
  const categoryId = anId();
  const inactive = aBoolean();
  const tags = aTagList();

  it('succeeds with valid data', () => {
    const result = Cashflow.create(
      id,
      effectiveDate,
      amount,
      intervalType,
      frequency,
      recurrence,
      description,
      accountId,
      categoryId,
      inactive,
      tags
    );
    expect(result).toBeSuccessWithValue({
      id: id,
      effectiveDate: effectiveDate,
      amount: amount,
      intervalType: intervalType,
      frequency: frequency,
      recurrence: recurrence,
      description: description,
      accountId: accountId,
      categoryId: categoryId,
      inactive: inactive,
      tags: tags,
    });
  });

  it('fails with invalid frequency', () => {
    const result = Cashflow.create(id, effectiveDate, amount, intervalType, 0, recurrence, description, accountId, categoryId, inactive, tags);
    expect(result).toBeFailureWithErrors([CashflowErrors.invalid]);
  });

  it('fails with invalid recurrence', () => {
    const result = Cashflow.create(id, effectiveDate, amount, intervalType, frequency, -1, description, accountId, categoryId, inactive, tags);
    expect(result).toBeFailureWithErrors([CashflowErrors.invalid]);
  });
});
