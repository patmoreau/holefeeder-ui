import { DateOnlyErrors } from '@/shared/core/date-only';
import { IdErrors } from '@/shared/core/id';
import { MoneyErrors } from '@/shared/core/money';
import { Account, AccountErrors } from '@/use-cases/core/accounts/account';
import { AccountTypes } from '@/use-cases/core/accounts/account-type';

describe('Account', () => {
  const validAccount = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    type: AccountTypes.checking,
    name: 'My Account',
    openBalance: 100,
    openDate: '2023-01-01',
    description: 'A description',
    favorite: false,
    inactive: false,
  };

  it('create a valid account', () => {
    const result = Account.create(validAccount);

    expect(result).toBeSuccessWithValue(
      expect.objectContaining({
        name: validAccount.name,
        type: validAccount.type,
        openBalance: validAccount.openBalance,
        openDate: validAccount.openDate,
        description: validAccount.description,
        favorite: validAccount.favorite,
        inactive: validAccount.inactive,
      })
    );
  });

  it('rejects invalid name (empty)', () => {
    const result = Account.create({ ...validAccount, name: '' });
    expect(result).toBeFailureWithErrors([AccountErrors.invalidName]);
  });

  it('rejects invalid name (wrong type)', () => {
    const result = Account.create({ ...validAccount, name: 123 });
    expect(result).toBeFailureWithErrors([AccountErrors.invalidName]);
  });

  it('rejects invalid openBalance', () => {
    const result = Account.create({ ...validAccount, openBalance: -100 });
    expect(result).toBeFailureWithErrors([MoneyErrors.invalid]);
  });

  it('rejects invalid openDate', () => {
    const result = Account.create({ ...validAccount, openDate: 'invalid-date' });
    expect(result).toBeFailureWithErrors([DateOnlyErrors.invalid]);
  });

  it('rejects invalid description (wrong type)', () => {
    const result = Account.create({ ...validAccount, description: 123 });
    expect(result).toBeFailureWithErrors([AccountErrors.invalidDescription]);
  });

  it('rejects invalid favorite (wrong type)', () => {
    const result = Account.create({ ...validAccount, favorite: 'yes' });
    expect(result).toBeFailureWithErrors([AccountErrors.invalidFavorite]);
  });

  it('rejects invalid inactive (wrong type)', () => {
    const result = Account.create({ ...validAccount, inactive: 'no' });
    expect(result).toBeFailureWithErrors([AccountErrors.invalidInactive]);
  });

  it('rejects invalid id', () => {
    const result = Account.create({ ...validAccount, id: 'invalid-id' });
    expect(result).toBeFailureWithErrors([IdErrors.invalid]);
  });

  it('accepts empty description', () => {
    const result = Account.create({ ...validAccount, description: '' });
    expect(result).toBeSuccessWithValue(expect.objectContaining({ description: '' }));
  });
});
