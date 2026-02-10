import { anAccount } from '@/__tests__/builders/account-for-test';
import { aTransaction, toTransaction } from '@/__tests__/builders/transaction-for-test';
import { aPastDate } from '@/__tests__/mocks/date-builder';
import { DateOnly } from '@/shared/core/date-only';
import { Money } from '@/shared/core/money';
import { AccountTypes } from '@/use-cases/core/accounts/account-type';
import { CategoryTypes } from '@/use-cases/core/categories/category-type';
import { Transaction } from './transaction';

describe('Transaction', () => {
  const validTransaction = toTransaction(aTransaction());

  describe('valid', () => {
    it('create a valid transaction', () => {
      const result = Transaction.valid(validTransaction);

      expect(result).toEqual(validTransaction);
    });

    it('create a valid transaction with optional fields', () => {
      const transactionWithOptionals = {
        ...validTransaction,
        cashflowId: '550e8400-e29b-41d4-a716-446655440000',
        cashflowDate: '2026-02-15',
      };
      const result = Transaction.valid(transactionWithOptionals);

      expect(result).toEqual(transactionWithOptionals);
    });

    it('create a valid transaction without optional fields', () => {
      const { cashflowId, cashflowDate, ...transactionWithoutOptionals } = validTransaction;
      const result = Transaction.valid(transactionWithoutOptionals);

      expect(result).toEqual(transactionWithoutOptionals);
    });
  });

  describe('calculateAdjustedAmount', () => {
    it('calculate adjusted amount for a debit account', () => {
      const account = anAccount({ type: AccountTypes.checking, openBalance: Money.valid(1000) });
      const transactions = [
        aTransaction({ amount: Money.valid(100), categoryType: CategoryTypes.gain }),
        aTransaction({ amount: Money.valid(300), categoryType: CategoryTypes.expense }),
      ];
      const result = Transaction.calculateBalance(account, transactions);

      expect(result).toEqual(Money.valid(800));
    });

    it('calculate adjusted amount for a credit account', () => {
      const account = anAccount({ type: AccountTypes.creditCard, openBalance: Money.valid(1000) });
      const transactions = [
        aTransaction({ amount: Money.valid(100), categoryType: CategoryTypes.gain }),
        aTransaction({ amount: Money.valid(300), categoryType: CategoryTypes.expense }),
      ];
      const result = Transaction.calculateBalance(account, transactions);

      expect(result).toEqual(Money.valid(1200));
    });
  });

  describe('calculateUpdatedDate', () => {
    it('when no transactions, return account openDate', () => {
      const account = anAccount({ openDate: aPastDate() });
      const transactions: Transaction[] = [];

      const result = Transaction.calculateUpdatedDate(account, transactions);

      expect(result).toEqual(account.openDate);
    });

    it('when multiple transactions, returns most recent transaction date', () => {
      const account = anAccount({ openDate: DateOnly.valid('2023-01-01') });
      const transactions = [aTransaction({ date: DateOnly.valid('2025-01-01') }), aTransaction({ date: DateOnly.valid('2024-01-01') })];

      const result = Transaction.calculateUpdatedDate(account, transactions);

      expect(result).toEqual('2025-01-01');
    });
  });
});
