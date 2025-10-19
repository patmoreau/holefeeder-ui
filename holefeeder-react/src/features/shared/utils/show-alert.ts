import { Alert } from 'react-native';

interface AlertCallbacks {
  onCancel?: () => void;
  onConfirm: () => void;
}

export const showAlert = (t: (key: string, options?: any) => string) => {
  const showDiscardAlert = ({ onConfirm, onCancel }: AlertCallbacks) => {
    Alert.alert(t('alert.discard.title'), t('alert.discard.message'), [
      {
        text: t('alert.discard.cancelText'),
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: t('alert.discard.confirmText'),
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
  };

  return { showDiscardAlert };
};
