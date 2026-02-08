import { AccountType, AccountTypeErrors, AccountTypes } from '@/use-cases/core/accounts/account-type';

describe('AccountType', () => {
  it.each(Object.values(AccountTypes))('accepts %s for AccountType', (value) => {
    const result = AccountType.create(value);
    expect(result).toBeSuccessWithValue(value);
  });

  it('rejects invalid AccountType', () => {
    const result = AccountType.create('invalid-type');
    expect(result).toBeFailureWithErrors([AccountTypeErrors.invalid]);
  });

  it('rejects empty AccountType', () => {
    const result = AccountType.create('');
    expect(result).toBeFailureWithErrors([AccountTypeErrors.invalid]);
  });

  it('rejects wrong type AccountType', () => {
    const result = AccountType.create(123);
    expect(result).toBeFailureWithErrors([AccountTypeErrors.invalid]);
  });

  it('valid returns the value directly', () => {
    const value = AccountTypes.checking;
    const result = AccountType.valid(value);
    expect(result).toBe(value);
  });

  it('valid returns normalized value', () => {
    expect(AccountType.valid(' Checking ')).toBe(AccountTypes.checking);
    expect(AccountType.valid(' Credit_Card ')).toBe(AccountTypes.creditCard);
  });

  it('create returns normalized value', () => {
    expect(AccountType.create(' Checking ')).toBeSuccessWithValue(AccountTypes.checking);
    expect(AccountType.create(' Credit_Card ')).toBeSuccessWithValue(AccountTypes.creditCard);
  });
});
