import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { CreateFlowUseCase } from '@/use-cases/core/flows/create-flow/create-flow-use-case';
import { Transaction } from '@/use-cases/core/flows/transaction';
import { Command } from '@/use-cases/core/use-cases';
import { FlowsRepositoryInPowersync } from '@/use-cases/persistence/flows-repository-in-powersync';

export const CreateFlowForm = (db: AbstractPowerSyncDatabase): Command<Transaction, Record<string, unknown>> => {
  const repository = FlowsRepositoryInPowersync(db);

  const execute = async (form: Record<string, unknown>) => {
    const result = CreateFlowCommand.create(form);
    if (result.isLoading || result.isFailure) return result;

    const useCase = CreateFlowUseCase(repository);
    return await useCase.execute(result.value);
  };

  return {
    execute: execute,
  };
};
