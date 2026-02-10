import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { anId } from '@/__tests__/mocks/string-builder';
import { DateIntervalTypes } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Money } from '@/shared/core/money';
import { CategoryTypes } from '@/use-cases/core/categories/category-type';
import { aCashflow, toCashflow } from '@/use-cases/core/flows/__tests__/cashflow-for-test';
import { Cashflow, CashflowErrors } from './cashflow';

describe('Cashflow', () => {
  describe('create', () => {
    it('succeeds with valid data', () => {
      const cashflow = aCashflow();
      const result = Cashflow.create(cashflow);
      expect(result).toBeSuccessWithValue(toCashflow(cashflow));
    });

    it('fails with invalid frequency', () => {
      const cashflow = aCashflow({ frequency: 0 });
      const result = Cashflow.create(cashflow);
      expect(result).toBeFailureWithErrors([CashflowErrors.invalid]);
    });

    it('fails with invalid recurrence', () => {
      const cashflow = aCashflow({ recurrence: -1 });
      const result = Cashflow.create(cashflow);
      expect(result).toBeFailureWithErrors([CashflowErrors.invalid]);
    });
  });

  describe('lastPaidDate', () => {
    it('fails when never paid', () => {
      const cashflow = aCashflow();
      const forTransactions = Cashflow.forTransactions([aTransaction({ date: DateOnly.valid('2026-01-01'), cashflowId: anId() })]);

      const result = forTransactions.lastPaidDate(cashflow);

      expect(result).toBeFailureWithErrors([CashflowErrors.neverPaid]);
    });

    it('succeeds when paid and returns latest date', () => {
      const cashflow = aCashflow();
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id }),
        aTransaction({ date: DateOnly.valid('2026-01-01') }),
        aTransaction({ date: DateOnly.valid('2023-01-01'), cashflowId: cashflow.id }),
      ]);

      const result = forTransactions.lastPaidDate(cashflow);

      expect(result).toBeSuccessWithValue('2025-01-01');
    });
  });

  describe('lastCashflowDate', () => {
    it('fails when never paid', () => {
      const cashflow = aCashflow();
      const forTransactions = Cashflow.forTransactions([aTransaction({ date: DateOnly.valid('2026-01-01'), cashflowId: anId() })]);

      const result = forTransactions.lastCashflowDate(cashflow);

      expect(result).toBeFailureWithErrors([CashflowErrors.neverPaid]);
    });

    it('succeeds when paid and returns latest cashflow date', () => {
      const cashflow = aCashflow();
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ cashflowDate: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id }),
        aTransaction({ cashflowDate: DateOnly.valid('2026-01-01') }),
        aTransaction({ cashflowDate: DateOnly.valid('2023-01-01'), cashflowId: cashflow.id }),
      ]);

      const result = forTransactions.lastCashflowDate(cashflow);

      expect(result).toBeSuccessWithValue('2025-01-01');
    });
  });

  describe('isNotPaid', () => {
    it.each([DateOnly.valid('2025-01-01'), DateOnly.valid('2026-01-01')])(
      'is not paid when cashflow was never paid and nextDate >= effectiveDate',
      (nextDate: DateOnly) => {
        const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
        const forTransactions = Cashflow.forTransactions([]);

        const result = forTransactions.isNotPaid(cashflow, nextDate);

        expect(result).toBe(true);
      }
    );

    it('cannot be not paid when cashflow was never paid and cashflow not yet effective (nextDate < effectiveDate)', () => {
      const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([]);

      const result = forTransactions.isNotPaid(cashflow, DateOnly.valid('2024-01-01'));

      expect(result).toBe(false);
    });

    it('is not paid when nextDate is after latest transaction date with a previous cashflow date', () => {
      const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2026-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-15'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.isNotPaid(cashflow, DateOnly.valid('2025-03-01'));
      expect(result).toBe(true);
    });

    it('is not paid when nextDate is after latest transaction date with a previous cashflow date', () => {
      const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2026-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-15'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.isNotPaid(cashflow, DateOnly.valid('2025-03-01'));
      expect(result).toBe(true);
    });

    it('is paid when nextDate is after latest transaction date with a previous cashflow date', () => {
      const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2026-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-15'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.isNotPaid(cashflow, DateOnly.valid('2025-02-01'));
      expect(result).toBe(false);
    });

    it('is not paid when nextDate is after latest transaction date with no previous cashflow date', () => {
      const cashflow = aCashflow({ effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2026-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-15') }),
      ]);

      const result = forTransactions.isNotPaid(cashflow, DateOnly.valid('2025-03-01'));
      expect(result).toBe(true);
    });
  });

  describe('getUpcomingDates', () => {
    it('returns no dates when inactive', () => {
      const cashflow = aCashflow({ inactive: true });
      const forTransactions = Cashflow.forTransactions([]);

      const result = forTransactions.getUpcomingDates(cashflow, DateOnly.valid('2025-03-01'));
      expect(result).toStrictEqual([]);
    });

    it('returns unpaid cashflow date', () => {
      const cashflow = aCashflow({ intervalType: DateIntervalTypes.monthly, frequency: 1, effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.getUpcomingDates(cashflow, DateOnly.valid('2025-03-01'));
      expect(result).toStrictEqual([DateOnly.valid('2025-03-01')]);
    });

    it('returns all unpaid cashflow dates', () => {
      const cashflow = aCashflow({ intervalType: DateIntervalTypes.monthly, frequency: 1, effectiveDate: DateOnly.valid('2025-01-01') });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.getUpcomingDates(cashflow, DateOnly.valid('2025-06-30'));
      expect(result).toStrictEqual([
        DateOnly.valid('2025-03-01'),
        DateOnly.valid('2025-04-01'),
        DateOnly.valid('2025-05-01'),
        DateOnly.valid('2025-06-01'),
      ]);
    });
  });

  describe('calculateUpcomingVariation', () => {
    it('returns all unpaid cashflow dates', () => {
      const cashflow = aCashflow({
        amount: Money.valid(10.12),
        categoryType: CategoryTypes.expense,
        intervalType: DateIntervalTypes.monthly,
        frequency: 1,
        effectiveDate: DateOnly.valid('2025-01-01'),
      });
      const forTransactions = Cashflow.forTransactions([
        aTransaction({ date: DateOnly.valid('2025-01-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-01-01') }),
        aTransaction({ date: DateOnly.valid('2025-02-01'), cashflowId: cashflow.id, cashflowDate: DateOnly.valid('2025-02-01') }),
      ]);

      const result = forTransactions.calculateUpcomingVariation(cashflow, DateOnly.valid('2025-06-30'));
      expect(result).toBe(-40.48);
    });
  });
});
