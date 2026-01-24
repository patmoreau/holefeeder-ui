# PowerSync Error Handling Examples

This document provides practical examples of error handling for PowerSync database operations in the Holefeeder app.

## Table of Contents
1. [Basic Error Handling](#basic-error-handling)
2. [Transaction Error Handling](#transaction-error-handling)
3. [Specific Error Cases](#specific-error-cases)
4. [Error Logging](#error-logging)
5. [Testing Error Handling](#testing-error-handling)

## Basic Error Handling

### Single Insert Operation

```typescript
const savePurchase = async (purchase: MakePurchase): Promise<Result<Transaction>> => {
  const transaction: Transaction = {
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
        null,
        null,
        transaction.tags.join(','),
      ]
    );

    return Result.success(transaction);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save purchase:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to save purchase']);
  }
};
```

### Query Operation

```typescript
const getTransaction = async (id: string): Promise<Result<Transaction | null>> => {
  try {
    const rows = await db.getAll<RawTransaction>(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return Result.success(null);
    }

    const transaction = mapRawToTransaction(rows[0]);
    return Result.success(transaction);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch transaction:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to fetch transaction']);
  }
};
```

### Update Operation

```typescript
const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<Result<void>> => {
  try {
    await db.execute(
      `UPDATE transactions 
       SET description = ?, amount = ? 
       WHERE id = ?`,
      [updates.description, Money.toCents(updates.amount!), id]
    );

    return Result.success(undefined);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update transaction:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to update transaction']);
  }
};
```

### Delete Operation

```typescript
const deleteTransaction = async (id: string): Promise<Result<void>> => {
  try {
    await db.execute('DELETE FROM transactions WHERE id = ?', [id]);
    return Result.success(undefined);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to delete transaction:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to delete transaction']);
  }
};
```

## Transaction Error Handling

### Simple Transaction

```typescript
const saveTransfer = async (formData: PurchaseFormData): Promise<Result<string>> => {
  const transferId = Id.newId();
  const amountInCents = Math.round(formData.amount * 100);

  try {
    await db.writeTransaction(async (tx) => {
      // Debit from source account
      await tx.execute(
        `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          transferId,
          formData.date,
          -amountInCents,
          formData.description,
          formData.sourceAccount.id,
          null,
          '[]',
        ]
      );

      // Credit to target account
      const creditId = Id.newId();
      await tx.execute(
        `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          creditId,
          formData.date,
          amountInCents,
          formData.description,
          formData.targetAccount.id,
          null,
          '[]',
        ]
      );
    });

    return Result.success(transferId);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save transfer:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to save transfer']);
  }
};
```

### Complex Transaction with Validation

```typescript
const payCashflow = async (
  cashflowId: string,
  paymentDate: string
): Promise<Result<Transaction>> => {
  try {
    let transaction: Transaction | null = null;

    await db.writeTransaction(async (tx) => {
      // 1. Fetch cashflow details
      const cashflows = await tx.getAll<RawCashflow>(
        'SELECT * FROM cashflows WHERE id = ?',
        [cashflowId]
      );

      if (cashflows.length === 0) {
        throw new Error('Cashflow not found');
      }

      const cashflow = cashflows[0];

      // 2. Create transaction
      const transactionId = Id.newId();
      await tx.execute(
        `INSERT INTO transactions (
          id, date, amount, description, account_id, category_id,
          cashflow_id, cashflow_date, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          paymentDate,
          cashflow.amount,
          cashflow.description,
          cashflow.account_id,
          cashflow.category_id,
          cashflowId,
          paymentDate,
          cashflow.tags || '',
        ]
      );

      // 3. Update cashflow
      await tx.execute(
        'UPDATE cashflows SET last_paid_date = ? WHERE id = ?',
        [paymentDate, cashflowId]
      );

      transaction = {
        id: transactionId,
        date: paymentDate,
        amount: Money.fromCents(cashflow.amount),
        description: cashflow.description,
        accountId: cashflow.account_id,
        categoryId: cashflow.category_id,
        cashflowId: cashflowId,
        cashflowDate: paymentDate,
        tags: cashflow.tags ? cashflow.tags.split(',') : [],
      };
    });

    if (!transaction) {
      return Result.failure(['Failed to create transaction']);
    }

    return Result.success(transaction);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to pay cashflow:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to pay cashflow']);
  }
};
```

## Specific Error Cases

### Handling Constraint Violations

```typescript
const saveAccount = async (account: Account): Promise<Result<Account>> => {
  try {
    await db.execute(
      `INSERT INTO accounts (
        id, type, name, favorite, open_balance, open_date, description, inactive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account.id,
        account.type,
        account.name,
        account.favorite ? 1 : 0,
        Money.toCents(account.openBalance),
        account.openDate,
        account.description,
        account.inactive ? 1 : 0,
      ]
    );

    return Result.success(account);
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific constraint violations
      if (error.message.includes('UNIQUE constraint failed: accounts.id')) {
        return Result.failure(['An account with this ID already exists']);
      }

      if (error.message.includes('NOT NULL constraint failed')) {
        const match = error.message.match(/accounts\.(\w+)/);
        const field = match ? match[1] : 'field';
        return Result.failure([`Required field '${field}' is missing`]);
      }

      if (error.message.includes('FOREIGN KEY constraint failed')) {
        return Result.failure(['Invalid reference to related data']);
      }

      // Generic error
      console.error('Failed to save account:', error.message);
      return Result.failure([error.message]);
    }

    return Result.failure(['Failed to save account']);
  }
};
```

### Handling Missing Records

```typescript
const updateAccount = async (
  id: string,
  updates: Partial<Account>
): Promise<Result<Account>> => {
  try {
    // First check if the account exists
    const existing = await db.getAll<RawAccount>(
      'SELECT * FROM accounts WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return Result.failure(['Account not found']);
    }

    // Perform update
    await db.execute(
      `UPDATE accounts 
       SET name = ?, description = ? 
       WHERE id = ?`,
      [updates.name, updates.description, id]
    );

    // Fetch updated account
    const updated = await db.getAll<RawAccount>(
      'SELECT * FROM accounts WHERE id = ?',
      [id]
    );

    const account = mapRawToAccount(updated[0]);
    return Result.success(account);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update account:', error.message);
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to update account']);
  }
};
```

## Error Logging

### Basic Logging

```typescript
const saveTransaction = async (transaction: Transaction): Promise<Result<Transaction>> => {
  try {
    await db.execute('INSERT INTO transactions ...', [...params]);
    return Result.success(transaction);
  } catch (error) {
    // Log the error with context
    console.error('Database operation failed', {
      operation: 'saveTransaction',
      transactionId: transaction.id,
      accountId: transaction.accountId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof Error) {
      return Result.failure([error.message]);
    }
    return Result.failure(['Failed to save transaction']);
  }
};
```

### Advanced Logging with Error Tracking

```typescript
import * as Sentry from '@sentry/react-native'; // Example error tracking service

const saveTransaction = async (transaction: Transaction): Promise<Result<Transaction>> => {
  try {
    await db.execute('INSERT INTO transactions ...', [...params]);
    return Result.success(transaction);
  } catch (error) {
    // Log to console
    console.error('Failed to save transaction:', {
      transactionId: transaction.id,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      error,
    });

    // Send to error tracking service
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: {
          operation: 'saveTransaction',
          component: 'transactionRepository',
        },
        extra: {
          transactionId: transaction.id,
          accountId: transaction.accountId,
        },
      });

      return Result.failure([error.message]);
    }

    return Result.failure(['Failed to save transaction']);
  }
};
```

## Testing Error Handling

### Unit Test Example

```typescript
import { transactionRepository } from '@/core/persistence/transaction-repository';
import { aMakePurchase } from '@/__tests__/mocks/purchase-builder';

describe('transactionRepository', () => {
  describe('savePurchase', () => {
    it('should handle database errors gracefully', async () => {
      const mockDb = {
        execute: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      const repository = transactionRepository(mockDb as any);
      const purchase = aMakePurchase();

      const result = await repository.savePurchase(purchase);

      expect(result.isFailure()).toBe(true);
      expect(result.getErrors()).toContain('Database error');
    });

    it('should handle constraint violations', async () => {
      const mockDb = {
        execute: jest
          .fn()
          .mockRejectedValue(new Error('UNIQUE constraint failed: transactions.id')),
      };

      const repository = transactionRepository(mockDb as any);
      const purchase = aMakePurchase();

      const result = await repository.savePurchase(purchase);

      expect(result.isFailure()).toBe(true);
      expect(result.getErrors()[0]).toContain('UNIQUE constraint');
    });

    it('should handle unknown errors', async () => {
      const mockDb = {
        execute: jest.fn().mockRejectedValue('string error'), // Non-Error object
      };

      const repository = transactionRepository(mockDb as any);
      const purchase = aMakePurchase();

      const result = await repository.savePurchase(purchase);

      expect(result.isFailure()).toBe(true);
      expect(result.getErrors()).toContain('Failed to save purchase');
    });
  });
});
```

## Best Practices Summary

1. ✅ **Always wrap database operations in try-catch**
2. ✅ **Check if error is an Error instance** before accessing `.message`
3. ✅ **Return consistent error format** using the Result type
4. ✅ **Log errors with context** for debugging
5. ✅ **Handle specific error cases** (constraints, missing records, etc.)
6. ✅ **Use transactions for multi-step operations** to ensure atomicity
7. ✅ **Provide user-friendly error messages** instead of raw database errors
8. ✅ **Test error handling paths** in your unit tests
9. ✅ **Consider error tracking services** for production monitoring
10. ✅ **Document error scenarios** for future maintainers

## Common PowerSync Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `UNIQUE constraint failed: table.column` | Duplicate primary key or unique value | Check for existing records before insert |
| `FOREIGN KEY constraint failed` | Invalid reference to parent table | Validate referenced IDs exist |
| `NOT NULL constraint failed: table.column` | Missing required field | Ensure all required fields are provided |
| `no such table: table_name` | Table doesn't exist in schema | Check schema definition and migrations |
| `no such column: column_name` | Column doesn't exist | Verify column names match schema |
| `database is locked` | Another operation is in progress | Retry with exponential backoff |
| `datatype mismatch` | Wrong parameter type | Ensure parameter types match schema |

## Additional Resources

- [PowerSync Documentation](https://docs.powersync.com/)
- [SQLite Error Codes](https://www.sqlite.org/rescode.html)
- [Result Type Pattern](/src/shared/core/result.ts)
