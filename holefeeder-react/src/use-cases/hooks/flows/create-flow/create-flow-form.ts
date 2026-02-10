import { Repositories } from '@/contexts/RepositoryContext';
import { Id } from '@/shared/core/id';
import { CreateFlowCommand } from '@/use-cases/core/flows/create-flow/create-flow-command';
import { CreateFlowUseCase } from '@/use-cases/core/flows/create-flow/create-flow-use-case';
import { Command } from '@/use-cases/core/use-cases';

export const CreateFlowForm = (repositories: Repositories): Command<Id, Record<string, unknown>> => {
  const execute = async (form: Record<string, unknown>) => {
    console.log('CreateFlowForm.execute: ', form);
    const result = CreateFlowCommand.create(form);
    console.log('CreateFlowForm.execute: ', result);
    if (result.isLoading || result.isFailure) return result;

    const useCase = CreateFlowUseCase(repositories.flowRepository);
    return await useCase.execute(result.value);
  };

  return {
    execute: execute,
  };
};
