import { AbstractPowerSyncDatabase } from '@powersync/common';
import { AccountVariation } from '@/domain/core/accounts/account-variation';
import { CashflowVariation } from '@/domain/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { FlowsRepository, FlowsRepositoryErrors } from '@/domain/core/flows/flows-repository';
import { PayFlowCommand } from '@/domain/core/flows/pay-flow/pay-flow-command';
import { Tag } from '@/domain/core/flows/tag';
import { TagList } from '@/domain/core/flows/tag-list';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { type AsyncResult, Result } from '@/domain/core/result';
import { watchQuery } from '@/domain/persistence/watch-query';
import { PurchaseFormData } from '@/features/purchase/core/purchase-form-data';

type CashflowVariationRow = {
  id: string;
  accountId: string;
  lastPaidDate: string;
  lastCashflowDate: string;
  amount: number;
  description: string;
  effectiveDate: string;
  frequency: number;
  intervalType: string;
  categoryType: string;
  tags: string;
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

  const pay = async (command: PayFlowCommand): Promise<Result<Id>> => {
    const newId = Id.newId();

    try {
      await db.execute(
        `INSERT INTO transactions (id, date, amount, description, account_id, category_id, cashflow_id, cashflow_date, tags)
         SELECT ?, ?, ?, description, account_id, category_id, id, ?, tags
         FROM cashflows
         WHERE id = ?`,
        [newId, command.date, Money.toCents(command.amount), command.cashflowDate, command.cashflowId]
      );

      return Result.success(newId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${FlowsRepositoryErrors.payFlowCommandFailed}: `, error.message);
      }
      return Result.failure([FlowsRepositoryErrors.payFlowCommandFailed]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveTransfer = async (formData: PurchaseFormData): Promise<Result<void>> => {
    const transferId = Id.newId();
    const amountInCents = Math.round(formData.amount * 100);

    try {
      await db.writeTransaction(async (tx) => {
        await tx.execute(
          `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [transferId, formData.date, -amountInCents, formData.description, formData.sourceAccount.id, null, '[]']
        );

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

  const watchAccountVariations = (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) => {
    onDataChange(Result.loading());

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

  const watchCashflowVariations = (onDataChange: (result: AsyncResult<CashflowVariation[]>) => void) =>
    watchQuery<CashflowVariationRow, CashflowVariation>(
      db,
      `
        WITH tx_agg AS (SELECT cashflow_id,
                               MAX(date)          AS lastPaidDate,
                               MAX(cashflow_date) AS lastCashflowDate
                        FROM transactions
                        GROUP BY cashflow_id)
        SELECT c.id             AS id,
               c.account_id     AS accountId,
               tx.lastPaidDate,
               tx.lastCashflowDate,
               c.amount,
               COALESCE(NULLIF(c.description, ''), cc.name) AS description,
               c.effective_date AS effectiveDate,
               c.frequency,
               c.interval_type  AS intervalType,
               cc.type          AS categoryType,
               c.tags           AS tags
        FROM cashflows c
               LEFT JOIN tx_agg tx ON tx.cashflow_id = c.id
               JOIN categories cc ON cc.id = c.category_id
        WHERE c.inactive = 0
      `,
      [],
      (row) => CashflowVariation.valid({ ...row, amount: Money.fromCents(row.amount), tags: TagList.toArray(row.tags) }),
      onDataChange
    );

  const watchTags = (onDataChange: (result: AsyncResult<Tag[]>) => void) => {
    onDataChange(Result.loading());

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
        !data || data.length === 0 ? onDataChange(Result.success([])) : onDataChange(Result.success(data.map((row) => Tag.valid(row)))),
      onError: (error) => onDataChange(Result.failure([error.message])),
    });
  };

  return {
    create: create,
    pay: pay,
    watchTags: watchTags,
    watchAccountVariations: watchAccountVariations,
    watchCashflowVariations: watchCashflowVariations,
  };
};
