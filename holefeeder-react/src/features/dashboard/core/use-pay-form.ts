import { Repositories } from '@/contexts/RepositoryContext';
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

  return {
    pay: pay,
    clear: clear,
  };
};
