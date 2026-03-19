import { Repositories } from '@/contexts/RepositoryContext';
import { DeleteCashFlowUseCase } from '@/domain/core/flows/delete-cashflow/delete-cashflow-flow-use-case';
import { PayFlowUseCase } from '@/domain/core/flows/pay-flow/pay-flow-use-case';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { Money } from '@/domain/core/money';

export const useUpcomingFlow = (repositories: Repositories) => {
  const pay = (upcomingFlow: UpcomingFlow) => {
    const useCase = PayFlowUseCase(repositories.flowRepository);
    return useCase.execute({
      date: upcomingFlow.date,
      amount: upcomingFlow.amount,
      cashflowId: upcomingFlow.id,
      cashflowDate: upcomingFlow.date,
    });
  };

  const clear = (upcomingFlow: UpcomingFlow) => {
    const useCase = PayFlowUseCase(repositories.flowRepository);
    return useCase.execute({
      date: upcomingFlow.date,
      amount: Money.ZERO,
      cashflowId: upcomingFlow.id,
      cashflowDate: upcomingFlow.date,
    });
  };

  const deleteFlow = (upcomingFlow: UpcomingFlow) => {
    const useCase = DeleteCashFlowUseCase(repositories.flowRepository);
    return useCase.execute(upcomingFlow.id);
  };

  return {
    pay: pay,
    clear: clear,
    delete: deleteFlow,
  };
};
