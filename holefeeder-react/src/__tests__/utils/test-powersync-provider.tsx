// Mock database implementation for testing
class MockPowerSyncDatabase {
  private data: Map<string, any[]> = new Map();
  private closed = false;

  async execute(sql: string, params: any[] = []) {
    if (this.closed) {
      throw new Error('Database is closed');
    }

    // Simple INSERT parser
    const insertMatch = sql.match(/INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/i);
    if (insertMatch) {
      const table = insertMatch[1];
      const columns = insertMatch[2].split(',').map((c) => c.trim());
      const row: any = {};

      columns.forEach((col, index) => {
        row[col] = params[index];
      });

      if (!this.data.has(table)) {
        this.data.set(table, []);
      }
      this.data.get(table)!.push(row);
    }
  }

  async getAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.closed) {
      throw new Error('Database is closed');
    }

    // Special handling for tag extraction CTE query
    if (sql.includes('WITH RECURSIVE split') && sql.includes('FROM transactions')) {
      // Extract and count tags from transactions
      const transactions = this.data.get('transactions') || [];
      const tagCounts: Map<string, number> = new Map();

      transactions.forEach((transaction) => {
        if (transaction.tags) {
          const tags = transaction.tags.split(',').map((tag: string) => tag.trim());
          tags.forEach((tag: string) => {
            if (tag) {
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            }
          });
        }
      });

      // Convert to array and sort by count DESC
      const results = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      return results as T[];
    }

    // Simple SELECT parser
    const selectMatch = sql.match(/SELECT .+ FROM (\w+)/i);
    if (selectMatch) {
      const table = selectMatch[1];
      let results = [...(this.data.get(table) || [])];

      // Handle WHERE clause (simple equality check for inactive = 0)
      const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*(\d+)/i);
      if (whereMatch) {
        const column = whereMatch[1];
        const value = parseInt(whereMatch[2]);
        results = results.filter((row) => row[column] === value);
      }

      // Handle ORDER BY clause
      const orderMatch = sql.match(/ORDER BY\s+(.+?)(?:$|LIMIT)/i);
      if (orderMatch) {
        const orderClauses = orderMatch[1].split(',').map((clause) => clause.trim());
        results.sort((a, b) => {
          for (const clause of orderClauses) {
            const [column, direction] = clause.split(/\s+/);
            const dir = direction?.toUpperCase() === 'DESC' ? -1 : 1;

            if (a[column] < b[column]) return -1 * dir;
            if (a[column] > b[column]) return 1 * dir;
          }
          return 0;
        });
      }

      return results as T[];
    }

    return [];
  }

  async *watch<T = any>(sql: string, params: any[] = [], options?: any): AsyncIterableIterator<{ rows?: { _array: T[] } }> {
    if (this.closed) {
      throw new Error('Database is closed');
    }

    const data = await this.getAll<T>(sql, params);
    yield { rows: { _array: data } };

    // For testing, we don't need continuous watching
    // The async iterator just yields once and completes
  }

  async disconnectAndClear() {
    this.data.clear();
  }

  async close() {
    this.closed = true;
    this.data.clear();
  }

  registerListener(listener: any) {
    return () => {}; // Return a cleanup function
  }

  async connect() {}
  async disconnect() {}
}

// Helper to create a test database instance (mock)
export const createTestPowerSyncDb = () => {
  return new MockPowerSyncDatabase() as any;
};

// Create a mock implementation of usePowerSync for tests
export const createMockPowerSyncContext = (db?: any) => {
  const testDb = db || createTestPowerSyncDb();
  return {
    db: testDb,
    syncStatus: null,
  };
};
