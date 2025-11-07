import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/use-auth';

export const createMutationHook = <T>(
  resourceName: string,
  commandHandler: (data: T, authToken: string | null) => Promise<T | void>,
  affectedResources: string[] = [],
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
        return commandHandler(data, token);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [resourceName, 'list'],
        });
        affectedResources.forEach((resource) => {
          queryClient.invalidateQueries({
            queryKey: [resource, 'list'],
          });
        });
      },
    });
  };

  return { useCommand };
};
