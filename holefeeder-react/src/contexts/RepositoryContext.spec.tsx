import { AbstractPowerSyncDatabase } from '@powersync/common';
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { RepositoryProvider, useRepositories } from './RepositoryContext';

const mockDb = {
  query: jest.fn(),
  execute: jest.fn(),
} as unknown as AbstractPowerSyncDatabase;

describe('RepositoryContext', () => {
  it('should throw error when used outside of RepositoryProvider', () => {
    expect(() => {
      renderHook(() => useRepositories());
    }).toThrow('useRepositories must be used within a RepositoryProvider');
  });

  it('should provide all repositories when used within RepositoryProvider', () => {
    const { result } = renderHook(() => useRepositories(), {
      wrapper: ({ children }) => (
        <PowerSyncProviderForTest db={mockDb}>
          <RepositoryProvider>{children}</RepositoryProvider>
        </PowerSyncProviderForTest>
      ),
    });

    expect(result.current).toBeDefined();
    expect(result.current.accountRepository).toBeDefined();
    expect(result.current.categoryRepository).toBeDefined();
    expect(result.current.dashboardRepository).toBeDefined();
    expect(result.current.flowRepository).toBeDefined();
    expect(result.current.storeItemRepository).toBeDefined();
  });

  it('should return the same repository instances on multiple calls', () => {
    const { result } = renderHook(() => useRepositories(), {
      wrapper: ({ children }) => (
        <PowerSyncProviderForTest db={mockDb}>
          <RepositoryProvider>{children}</RepositoryProvider>
        </PowerSyncProviderForTest>
      ),
    });

    // Call useRepositories again
    const { result: result2 } = renderHook(() => useRepositories(), {
      wrapper: ({ children }) => (
        <PowerSyncProviderForTest db={mockDb}>
          <RepositoryProvider>{children}</RepositoryProvider>
        </PowerSyncProviderForTest>
      ),
    });

    // Should create new instances with new provider
    expect(result.current).toBeDefined();
    expect(result2.current).toBeDefined();
    expect(result.current.accountRepository).toBeDefined();
    expect(result2.current.accountRepository).toBeDefined();
  });
});
