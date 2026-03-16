import { DateOnly } from '@/domain/core/date-only';
import { Id } from '@/domain/core/id';
import { Money } from '@/domain/core/money';
import { Result } from '@/domain/core/result';
import { TagList } from './tag-list';

export type UpcomingFlow = {
  id: Id;
  date: DateOnly;
  amount: Money;
  description: string;
  tags: TagList;
};

const create = (value: Record<string, unknown>): Result<UpcomingFlow> =>
  Result.combine<UpcomingFlow>({
    id: Id.create(value.id),
    date: DateOnly.create(value.date),
    amount: Money.create(value.amount),
    description: Result.success(value.description as string),
    tags: TagList.create(value.tags),
  });

const valid = (value: Record<string, unknown>): UpcomingFlow => ({
  id: Id.valid(value.id as string),
  date: DateOnly.valid(value.date as string),
  amount: Money.valid(value.amount as number),
  description: value.description as string,
  tags: TagList.valid(value.tags as string[]),
});

export const UpcomingFlow = {
  create: create,
  valid: valid,
};
