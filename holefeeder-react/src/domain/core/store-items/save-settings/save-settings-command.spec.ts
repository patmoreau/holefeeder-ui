import { aSaveSettingsForm } from '@/domain/core/__tests__/save-settings-form-for-test';
import { DateIntervalTypeErrors } from '@/domain/core/date-interval-type';
import { DateOnlyErrors } from '@/domain/core/date-only';
import { SaveSettingsCommand, SaveSettingsCommandErrors } from '@/domain/core/store-items/save-settings/save-settings-command';

describe('SaveSettingsCommand', () => {
  it('succeeds with valid data', () => {
    const form = aSaveSettingsForm();
    const result = SaveSettingsCommand.create(form);
    expect(result).toBeSuccessWithValue({
      effectiveDate: form.effectiveDate,
      intervalType: form.intervalType,
      frequency: form.frequency,
    });
  });

  it('returns failure if effective date is invalid', () => {
    const form = aSaveSettingsForm({ effectiveDate: 'invalid-date' });
    const result = SaveSettingsCommand.create(form);
    expect(result).toBeFailureWithErrors([DateOnlyErrors.invalid]);
  });

  it('returns failure if interval type is invalid', () => {
    const form = aSaveSettingsForm({ intervalType: 'invalid' });
    const result = SaveSettingsCommand.create(form);
    expect(result).toBeFailureWithErrors([DateIntervalTypeErrors.invalid]);
  });

  it('returns failure if frequency is invalid', () => {
    const form = aSaveSettingsForm({ frequency: -1 });
    const result = SaveSettingsCommand.create(form);
    expect(result).toBeFailureWithErrors([SaveSettingsCommandErrors.invalidFrequency]);
  });
});
