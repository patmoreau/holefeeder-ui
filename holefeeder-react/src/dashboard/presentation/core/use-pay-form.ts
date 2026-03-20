import { Repositories } from '@/contexts/RepositoryContext';
import { DeactivateUpcomingFlowUseCase } from '@/flows/core/flows/deactivate-upcoming/deactivate-upcoming-flow-use-case';
import { PayUseCase } from '@/flows/core/flows/pay/pay-use-case';
import { UpcomingFlow } from '@/flows/core/flows/upcoming-flow';
import { Money } from '@/shared/core/money';

export const useUpcomingFlow = (repositories: Repositories) => {
  const pay = (upcomingFlow: UpcomingFlow) => {
    const useCase = PayUseCase(repositories.flowRepository);
    return useCase.execute({
      date: upcomingFlow.date,
      amount: upcomingFlow.amount,
      cashflowId: upcomingFlow.id,
      cashflowDate: upcomingFlow.date,
    });
  };

  const clear = (upcomingFlow: UpcomingFlow) => {
    const useCase = PayUseCase(repositories.flowRepository);
    return useCase.execute({
      date: upcomingFlow.date,
      amount: Money.ZERO,
      cashflowId: upcomingFlow.id,
      cashflowDate: upcomingFlow.date,
    });
  };

  const deleteFlow = (upcomingFlow: UpcomingFlow) => {
    const useCase = DeactivateUpcomingFlowUseCase(repositories.flowRepository);
    return useCase.execute(upcomingFlow.id);
  };

  return {
    pay: pay,
    clear: clear,
    delete: deleteFlow,
  };
};
