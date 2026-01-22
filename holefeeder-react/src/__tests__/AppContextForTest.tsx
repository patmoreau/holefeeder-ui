import { anAppState } from '@/__tests__/mocks/app-state-builder';
import { AppContext } from '@/contexts/AppContext';
import { AppState } from '@/types/app-state';

export const AppContextForTest = ({ children, overrides }: { children: React.ReactNode; overrides?: Partial<AppState> }) => {
  return <AppContext.Provider value={anAppState(overrides)}>{children}</AppContext.Provider>;
};
