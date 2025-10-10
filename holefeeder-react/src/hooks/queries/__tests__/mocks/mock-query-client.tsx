import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, RenderHookResult } from '@testing-library/react-native';

export const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
mockQueryClient.invalidateQueries = jest.fn();

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>;
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
};

const wrapper = createWrapper();

export function renderQueryHook<Result, Props>(callback: (props: Props) => Result, initialProps?: Props): RenderHookResult<Result, Props> {
  return renderHook(callback, {
    wrapper,
    initialProps,
  });
}
