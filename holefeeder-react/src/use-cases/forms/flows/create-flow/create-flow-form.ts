import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { CreateFlowUseCase } from '@/use-cases/core/flows/create-flow/create-flow-use-case';
import { flowsRepositoryInPowersync } from '@/use-cases/persistence/flows-repository-in-powersync';

export const CreateFlowForm = (db: AbstractPowerSyncDatabase) => {
  const repository = flowsRepositoryInPowersync(db);

  const createFlow = (form: Record<string, unknown>) => {
    const result = CreateFlowCommand.create(form);
    if (result.isFailure) return result;

    const useCase = CreateFlowUseCase(repository);
    return useCase.handle(result.value);
  };

  return {
    createFlow: createFlow,
  };
};
