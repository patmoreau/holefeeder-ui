import { Alert } from 'react-native';
import { tk } from '@/i18n/translations';

type AlertCallbacks = {
  onCancel?: () => void;
  onConfirm: () => void;
};

type FormErrorAlertProps = {
  errorCount: number;
};

export const showAlert = (t: (key: string, options?: any) => string) => {
  const showDiscardAlert = ({ onConfirm, onCancel }: AlertCallbacks) => {
    Alert.alert(t(tk.alert.discard.title), t(tk.alert.discard.message), [
      {
        text: t(tk.alert.discard.cancelText),
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: t(tk.alert.discard.confirmText),
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
  };

  const showFormErrorAlert = ({ errorCount }: FormErrorAlertProps) => {
    Alert.alert(t('alert.formError.title', { count: errorCount }), t('alert.formError.message', { count: errorCount }), [
      {
        text: t(tk.alert.formError.dismissText),
        style: 'cancel',
      },
    ]);
  };

  return { showDiscardAlert, showFormErrorAlert };
};
