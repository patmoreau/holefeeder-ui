import { AbstractPowerSyncDatabase } from '@powersync/common';
import { PurchaseFormData } from '@/features/purchase/core/purchase-form-data';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { Cashflow } from '@/use-cases/core/flows/cashflow';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { FlowsRepository, FlowsRepositoryErrors } from '@/use-cases/core/flows/flows-repository';
import { Tag } from '@/use-cases/core/flows/tag';
import { Transaction } from '@/use-cases/core/flows/transaction';

type CashflowRow = {
  id: string;
  effectiveDate: string;
  amount: number;
  intervalType: string;
  frequency: number;
  recurrence: number;
  description: string;
  accountId: string;
  categoryId: string;
  categoryType: string;
  inactive: number;
  tags: string;
};

type TransactionRow = {
  id: string;
  date: string;
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  categoryType: string;
  cashflowId: string | null;
  cashflowDate: string | null;
  tags: string;
};

type TagRow = {
  tag: string;
  count: number;
};

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

  const watchCashflows = (onDataChange: (result: Result<Cashflow[]>) => void) => {
    const query = db.query<CashflowRow>({
      sql: `
        SELECT
          c.id,
          c.effective_date as effectiveDate,
          c.amount,
          c.interval_type as intervalType,
          c.frequency,
          c.recurrence,
          c.description,
          c.account_id as accountId,
          c.category_id as categoryId,
          cc.type as categoryType,
          c.inactive,
          c.tags
        FROM cashflows c
               INNER JOIN categories cc ON cc.id = c.category_id;
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
                  Cashflow.valid({
                    ...row,
                    amount: Money.fromCents(row.amount),
                    inactive: row.inactive === 1,
                    tags: row.tags.split(',').filter((tag) => tag !== '') as string[],
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  const watchTransactions = (onDataChange: (result: Result<Transaction[]>) => void) => {
    const query = db.query<TransactionRow>({
      sql: `
          SELECT
            t.id,
            t.date,
            t.amount,
            t.description,
            t.account_id as accountId,
            t.category_id as categoryId,
            c.type as categoryType,
            t.cashflow_id as cashflowId,
            t.cashflow_date as cashflowDate,
            t.tags
          FROM transactions t
          INNER JOIN categories c ON c.id = category_id;
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
                  Transaction.valid({
                    ...row,
                    amount: Money.fromCents(row.amount),
                    tags: row.tags.split(',').filter((tag) => tag !== '') as string[],
                  })
                )
              )
            ),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  const watchTags = (onDataChange: (result: Result<Tag[]>) => void) => {
    const query = db.query<TagRow>({
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

  return { create: create, watchCashflows: watchCashflows, watchTransactions: watchTransactions, watchTags: watchTags };
};
