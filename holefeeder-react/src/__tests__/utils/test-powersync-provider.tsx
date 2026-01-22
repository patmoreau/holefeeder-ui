import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { renderHook, RenderHookResult } from '@testing-library/react-native';
import { PowerSyncProvider } from '@/contexts/PowersyncProvider';

const createWrapper = (db: AbstractPowerSyncDatabase) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <PowerSyncProvider db={db}>{children}</PowerSyncProvider>;
  Wrapper.displayName = 'PowerSyncTestWrapper';
  return Wrapper;
};

export function renderPowerSyncHook<Result, Props>(
  db: AbstractPowerSyncDatabase,
  callback: (props: Props) => Result,
  initialProps?: Props
): RenderHookResult<Result, Props> {
  return renderHook(callback, {
    wrapper: createWrapper(db),
    initialProps,
  });
}
