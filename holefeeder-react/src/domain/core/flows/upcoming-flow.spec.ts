import { aUpcomingFlow } from '@/domain/core/flows/__tests__/upcoming-flow-for-test';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { Id, IdErrors } from '@/domain/core/id';

describe('UpcomingFlow', () => {
  describe('create', () => {
    it('succeeds with valid data', () => {
      const upcomingFlow = aUpcomingFlow();
      const result = UpcomingFlow.create(upcomingFlow);
      expect(result).toBeSuccessWithValue(upcomingFlow);
    });

    it('fails with invalid id', () => {
      const upcomingFlow = aUpcomingFlow({ id: Id.valid('') });
      const result = UpcomingFlow.create(upcomingFlow);
      expect(result).toBeFailureWithErrors([IdErrors.invalid]);
    });
  });
});
