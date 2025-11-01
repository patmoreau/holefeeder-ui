import { Alert } from 'react-native';
import { showAlert } from './show-alert'; // Adjust the import path

const mockAlert = jest.spyOn(Alert, 'alert');

const mockT = jest.fn((key) => {
  const translations: { [key: string]: string } = {
    'alert.discard.title': 'Discard Changes',
    'alert.discard.message': 'Are you sure you want to discard your changes?',
    'alert.discard.cancelText': 'Cancel',
    'alert.discard.confirmText': 'Discard',
  };
  return translations[key] || '';
});

function findButton(text: string) {
  const alertArgs = mockAlert.mock.calls[0];
  const buttons = alertArgs[2];

  return buttons?.find((btn) => btn.text === text);
}

describe('showAlert', () => {
  afterEach(() => {
    mockAlert.mockClear();
  });

  it('returns an object with a showDiscardAlert method', () => {
    const alertFunctions = showAlert(mockT);
    expect(typeof alertFunctions).toBe('object');
    expect(typeof alertFunctions.showDiscardAlert).toBe('function');
  });

  describe('showDiscardAlert', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    let showDiscardAlert: ReturnType<typeof showAlert>['showDiscardAlert'];

    beforeEach(() => {
      ({ showDiscardAlert } = showAlert(mockT));
    });

    afterEach(() => {
      onConfirm.mockClear();
      onCancel.mockClear();
    });

    it('calls Alert.alert with the correct translated strings', () => {
      showDiscardAlert({ onConfirm, onCancel });

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        expect.arrayContaining([
          expect.objectContaining({
            text: 'Cancel',
            style: 'cancel',
            onPress: onCancel,
          }),
          expect.objectContaining({
            text: 'Discard',
            style: 'destructive',
            onPress: onConfirm,
          }),
        ])
      );
    });

    it('calls the onConfirm callback when the confirm button is pressed', () => {
      showDiscardAlert({ onConfirm, onCancel });

      findButton('Discard')?.onPress?.();

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls the onCancel callback when the cancel button is pressed', () => {
      showDiscardAlert({ onConfirm, onCancel });

      findButton('Cancel')?.onPress?.();

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
