import { DateIntervalType } from '@/domain/core/date-interval-type';
import { DateOnly } from '@/domain/core/date-only';
import { Result } from '@/domain/core/result';
import { createNumberValidator, Validate } from '@/domain/core/validate';

export type SaveSettingsCommand = {
  effectiveDate: DateOnly;
  intervalType: DateIntervalType;
  frequency: number;
};

export const SaveSettingsCommandErrors = {
  invalidFrequency: 'invalid-frequency',
};

const isValidFrequency = createNumberValidator({ min: 1 });

const create = (command: Record<string, unknown>): Result<SaveSettingsCommand> =>
  Result.combine<SaveSettingsCommand>({
    effectiveDate: DateOnly.create(command.effectiveDate),
    intervalType: DateIntervalType.create(command.intervalType),
    frequency: Validate.validateWithErrors<number>(isValidFrequency, command.frequency, [SaveSettingsCommandErrors.invalidFrequency]),
  });

export const SaveSettingsCommand = {
  create: create,
};
