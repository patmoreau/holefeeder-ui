import { Repositories } from '@/contexts/RepositoryContext';
import { CreateFlowCommand } from '@/domain/core/flows/create-flow/create-flow-command';
import { CreateFlowUseCase } from '@/domain/core/flows/create-flow/create-flow-use-case';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { Command } from '@/domain/core/use-cases';

export const CreateFlowForm = (repositories: Repositories): Command<Id, Record<string, unknown>> => {
  const execute = async (form: Record<string, unknown>): Promise<Result<Id>> => {
    console.log('CreateFlowForm.execute: ', form);
    const result = CreateFlowCommand.create(form);
    console.log('CreateFlowForm.execute: ', result);
    if (result.isFailure) return Result.failure(result.errors);

    const useCase = CreateFlowUseCase(repositories.flowRepository);
    return await useCase.execute(result.value);
  };

  return {
    execute: execute,
  };
};
