import { DateIntervalType } from '@/domain/core/date-interval-type';
import { FlowsRepository } from '@/domain/core/flows/flows-repository';
import { Id } from '@/domain/core/id';
import { Result } from '@/domain/core/result';
import { CreateFlowCommand } from './create-flow-command';

export type PurchaseForm = {
  date: string;
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  tags: string[];
  cashflow?: {
    effectiveDate: string;
    intervalType: DateIntervalType;
    frequency: number;
    recurrence: number;
  };
};

export const CreateFlowUseCase = (repository: FlowsRepository) => {
  const execute = async (flow: CreateFlowCommand): Promise<Result<Id>> => {
    return await repository.create(flow);
  };

  // const makeCashflow = (flow: CreateFlowCommand): Result<Cashflow | undefined> => {
  //   let cashflow: Cashflow | undefined = undefined;
  //   if (flow.cashflow) {
  //     const cashflowResult = Cashflow.create(
  //       Id.newId(),
  //       flow.cashflow.effectiveDate,
  //       flow.amount,
  //       flow.cashflow.intervalType,
  //       flow.cashflow.frequency,
  //       flow.cashflow.recurrence,
  //       flow.description,
  //       flow.accountId,
  //       flow.categoryId,
  //       false,
  //       flow.tags
  //     );
  //     if (cashflowResult.isFailure || cashflowResult.isLoading) {
  //       return cashflowResult;
  //     }
  //     cashflow = cashflowResult.value;
  //   }
  //   return Result.success(cashflow);
  // };

  return {
    execute: execute,
  };
};
