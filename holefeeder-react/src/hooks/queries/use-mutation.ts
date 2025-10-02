import { useAuth } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createMutationHook = <T>(
  resourceName: string,
  commandHandler: (data: T, authToken: string | null) => Promise<T | void>,
  withAuth: boolean = true
) => {
  const useCommand = () => {
    const { tokenInfo } = useAuth();
    const queryClient = useQueryClient();
    const token = withAuth ? tokenInfo.accessToken : null;

    return useMutation({
      mutationFn: (data: T) => {
        if (withAuth && !tokenInfo?.accessToken) {
          throw new Error('Authentication token required but not available');
        }
        const token = withAuth ? tokenInfo?.accessToken : null;
        return commandHandler(data, token);
      },
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [resourceName, 'list'],
        }),
    });
  };

  return { useCommand };
};
