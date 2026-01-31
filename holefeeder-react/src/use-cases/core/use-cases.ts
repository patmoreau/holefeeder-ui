import { Result } from '@/shared/core/result';

export type Command<O, I> = {
  execute(input: I): Promise<Result<O>>;
};

export type Query<I, O> = I extends void
  ? {
      query: (onDataChange: (result: Result<O>) => void) => () => void;
    }
  : {
      query: (input: I, onDataChange: (result: Result<O>) => void) => () => void;
    };
