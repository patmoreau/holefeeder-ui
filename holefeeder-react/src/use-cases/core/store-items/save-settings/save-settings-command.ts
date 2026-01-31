import { DateIntervalType } from '@/shared/core/date-interval-type';
import { DateOnly } from '@/shared/core/date-only';
import { Result } from '@/shared/core/result';
import { Validate } from '@/shared/core/validate';

export type SaveSettingsCommand = {
  effectiveDate: DateOnly;
  intervalType: DateIntervalType;
  frequency: number;
};

export const SaveSettingsCommandErrors = {
  invalidFrequency: 'invalid-frequency',
};

const schema = {
  $id: 'frequency',
  type: 'number',
  minimum: 1,
};

const create = (command: Record<string, unknown>): Result<SaveSettingsCommand> =>
  Result.combine<SaveSettingsCommand>({
    effectiveDate: DateOnly.create(command.effectiveDate),
    intervalType: DateIntervalType.create(command.intervalType),
    frequency: Validate.validateWithErrors<number>(schema, command.frequency, [SaveSettingsCommandErrors.invalidFrequency]),
  });

export const SaveSettingsCommand = {
  create: create,
};
