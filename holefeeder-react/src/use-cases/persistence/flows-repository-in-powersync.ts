import { AbstractPowerSyncDatabase } from '@powersync/common';
import { PurchaseFormData } from '@/features/purchase/core/purchase-form-data';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { AccountVariation } from '@/use-cases/core/accounts/account-variation';
import { CashflowVariation } from '@/use-cases/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { FlowsRepository, FlowsRepositoryErrors } from '@/use-cases/core/flows/flows-repository';
import { Tag } from '@/use-cases/core/flows/tag';

export const FlowsRepositoryInPowersync = (db: AbstractPowerSyncDatabase): FlowsRepository => {
  const create = async (purchase: CreateFlowCommand): Promise<Result<Id>> => {
    const transaction = {
      id: Id.newId(),
      date: purchase.date,
      amount: purchase.amount,
      description: purchase.description,
      accountId: purchase.accountId,
      categoryId: purchase.categoryId,
      tags: purchase.tags,
    };
    try {
      await db.execute(
        `INSERT INTO transactions (
        id, date, amount, description, account_id, category_id, 
        cashflow_id, cashflow_date, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.date,
          Money.toCents(transaction.amount),
          transaction.description,
          transaction.accountId,
          transaction.categoryId,
          null, // cashflow_id - to be implemented
          null, // cashflow_date
          transaction.tags.join(','),
        ]
      );

      return Result.success(transaction.id);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${FlowsRepositoryErrors.createFlowCommandFailed}: `, error.message);
      }
      return Result.failure([FlowsRepositoryErrors.createFlowCommandFailed]);
    }
  };

  const saveTransfer = async (formData: PurchaseFormData): Promise<Result<void>> => {
    const transferId = Id.newId();
    const amountInCents = Math.round(formData.amount * 100);

    try {
      await db.writeTransaction(async (tx) => {
        // Debit from source account
        await tx.execute(
          `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [transferId, formData.date, -amountInCents, formData.description, formData.sourceAccount.id, null, '[]']
        );

        // Credit to target account
        const creditId = Id.newId();
        await tx.execute(
          `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [creditId, formData.date, amountInCents, formData.description, formData.targetAccount.id, null, '[]']
        );
      });

      return Result.success();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to save transfer:', error.message);
        return Result.failure([error.message]);
      }
      return Result.failure(['Failed to save transfer']);
    }
  };

  const watchAccountVariations = (onDataChange: (result: Result<AccountVariation[]>) => void) => {
    const query = db.query<{ accountId: string; lastTransactionDate: string; expenses: number; gains: number }>({
      sql: `
        SELECT
          t.account_id as accountId,
          MAX(t.date) as lastTransactionDate,
          SUM(CASE WHEN lower(c.type) = 'expense' THEN t.amount ELSE 0 END) as expenses,
          SUM(CASE WHEN lower(c.type) = 'gain' THEN t.amount ELSE 0 END) as gains
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        JOIN accounts a ON a.id = t.account_id
        WHERE a.inactive = 0
        GROUP BY t.account_id
      `,
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.success([]))
          : onDataChange(
              Result.success(
                data.map((row) =>
                  AccountVariation.valid({
                    ...row,
                    expenses: Money.fromCents(row.expenses),
                    gains: Money.fromCents(row.gains),
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  const watchCashflowVariations = (onDataChange: (result: Result<CashflowVariation[]>) => void) => {
    const query = db.query<{
      accountId: string;
      cashflowId: string;
      lastPaidDate: string;
      lastCashflowDate: string;
      amount: number;
      effectiveDate: string;
      frequency: number;
      intervalType: string;
      categoryType: string;
    }>({
      sql: `
        SELECT
          c.account_id as accountId,
          c.id as cashflowId,
          MAX(t.date) as lastPaidDate,
          MAX(t.cashflow_date) as lastCashflowDate,
          c.amount,
          c.effective_date as effectiveDate,
          c.frequency,
          c.interval_type as intervalType,
          cc.type as categoryType
        FROM cashflows c
        LEFT JOIN transactions t ON t.cashflow_id = c.id
        JOIN categories cc ON cc.id = c.category_id
        WHERE c.inactive = 0
        GROUP BY c.id, c.account_id, c.amount, c.effective_date, c.frequency, c.interval_type, cc.type
      `,
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.success([]))
          : onDataChange(
              Result.success(
                data.map((row) =>
                  CashflowVariation.valid({
                    ...row,
                    amount: Money.fromCents(row.amount),
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  const watchTags = (onDataChange: (result: Result<Tag[]>) => void) => {
    const query = db.query<{ tag: string; count: number }>({
      sql: `
          WITH RECURSIVE split(tag, remainder) AS
                     (SELECT
                             Ltrim(Substr(tags || ',', 1, Instr(tags || ',', ',') - 1)) AS tag,
                             Substr(tags || ',', Instr(tags || ',', ',') + 1)           AS remainder
                      FROM transactions
                      WHERE tags IS NOT NULL AND tags <> ''
                      UNION ALL
                      SELECT
                             Ltrim(Substr(remainder, 1, Instr(remainder, ',') - 1)) AS tag,
                             Substr(remainder, Instr(remainder, ',') + 1)           AS remainder
                      FROM split
                      WHERE remainder <> '')
          SELECT tag,
                COUNT(*) AS count
          FROM split
          WHERE tag <> ''
          GROUP BY tag
          ORDER BY count DESC, tag;
      `,
      parameters: [],
    });

    const watcher = query.watch();

    return watcher.registerListener({
      onData: (data) =>
        !data || data.length === 0
          ? onDataChange(Result.failure([FlowsRepositoryErrors.noTags]))
          : onDataChange(Result.success(data.map((row) => Tag.valid(row)))),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    create: create,
    watchTags: watchTags,
    watchAccountVariations: watchAccountVariations,
    watchCashflowVariations: watchCashflowVariations,
  };
};
