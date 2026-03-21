import { AbstractPowerSyncDatabase } from '@powersync/common';
import { AccountVariation } from '@/flows/core/accounts/account-variation';
import { CashflowVariation } from '@/flows/core/flows/cashflow-variation';
import { CreateFlowCommand } from '@/flows/core/flows/create/create-flow-command';
import { FlowsRepository, FlowsRepositoryErrors } from '@/flows/core/flows/flows-repository';
import { PayFlowCommand } from '@/flows/core/flows/pay/pay-flow-command';
import { Tag } from '@/flows/core/flows/tag';
import { TagList } from '@/flows/core/flows/tag-list';
import { TransferFlowCommand } from '@/flows/core/flows/transfer/transfer-flow-command';
import { Id } from '@/shared/core/id';
import { Money } from '@/shared/core/money';
import { type AsyncResult, Result } from '@/shared/core/result';
import { watchQuery } from '@/shared/persistence/watch-query';

type AccountVariationRow = { accountId: string; lastTransactionDate: string; expenses: number; gains: number };

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

type TagRow = { tag: string; count: number };

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
        `
          INSERT INTO transactions (id, date, amount, description, account_id, category_id,
                                    cashflow_id, cashflow_date, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
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
        `
          INSERT INTO transactions (id, date, amount, description, account_id, category_id, cashflow_id, cashflow_date,
                                    tags)
          SELECT ?,
                 ?,
                 ?,
                 description,
                 account_id,
                 category_id,
                 id,
                 ?,
                 tags
          FROM cashflows
          WHERE id = ?
        `,
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

  const deactivateUpcoming = async (cashflowId: Id): Promise<Result<void>> => {
    try {
      console.debug(`Marking cashflow ${cashflowId} as inactive...`);
      await db.execute(
        `
          UPDATE cashflows
          SET inactive = 1
          WHERE id = ?
        `,
        [cashflowId]
      );

      return Result.success();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`${FlowsRepositoryErrors.payFlowCommandFailed}: `, error.message);
      }
      return Result.failure([FlowsRepositoryErrors.payFlowCommandFailed]);
    }
  };

  const transfer = async (transfer: TransferFlowCommand): Promise<Result<void>> => {
    const sourceId = Id.newId();
    const targetId = Id.newId();

    try {
      await db.writeTransaction(async (tx) => {
        await tx.execute(
          `
            INSERT INTO transactions (id, date, amount, description, account_id, category_id)
            SELECT ?,
                   ?,
                   ?,
                   ?,
                   ?,
                   c.id
            FROM categories c
            WHERE name = 'Transfer Out'
          `,
          [sourceId, transfer.date, Money.toCents(transfer.amount), transfer.description, transfer.sourceAccountId]
        );

        await tx.execute(
          `
            INSERT INTO transactions (id, date, amount, description, account_id, category_id)
            SELECT ?,
                   ?,
                   ?,
                   ?,
                   ?,
                   c.id
            FROM categories c
            WHERE name = 'Transfer In'
        `,
          [targetId, transfer.date, Money.toCents(transfer.amount), transfer.description, transfer.targetAccountId]
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

  const watchAccountVariations = (onDataChange: (result: AsyncResult<AccountVariation[]>) => void) =>
    watchQuery<AccountVariationRow, AccountVariation>(
      db,
      `
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
      [],
      (row) =>
        AccountVariation.valid({
          ...row,
          expenses: Money.fromCents(row.expenses),
          gains: Money.fromCents(row.gains),
        }),
      onDataChange
    );

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

  const watchTags = (onDataChange: (result: AsyncResult<Tag[]>) => void) =>
    watchQuery<TagRow, Tag>(
      db,
      `
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
      [],
      (row) => Tag.valid(row),
      onDataChange
    );

  return {
    create: create,
    pay: pay,
    deactivateUpcoming: deactivateUpcoming,
    transfer: transfer,
    watchTags: watchTags,
    watchAccountVariations: watchAccountVariations,
    watchCashflowVariations: watchCashflowVariations,
  };
};
