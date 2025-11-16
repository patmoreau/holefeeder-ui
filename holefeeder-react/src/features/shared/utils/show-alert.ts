import { Alert } from 'react-native';
import { tk } from '@/i18n/translations';

type AlertCallbacks = {
  onCancel?: () => void;
  onConfirm: () => void;
};

type FormErrorAlertProps = {
  errorCount: number;
  errors: Record<string, string>;
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

  const showFormErrorAlert = ({ errorCount, errors }: FormErrorAlertProps) => {
    console.debug('showFormErrorAlert called with errors:', errorCount);
    console.debug('showFormErrorAlert called with errors:', errors);
    const errorsList = Object.entries(errors)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    Alert.alert(
      t('alert.formError.title', { count: errorCount }),
      __DEV__ ? `${t('alert.formError.message', { count: errorCount })}\n\n${errorsList}` : t('alert.formError.message', { count: errorCount }),
      [
        {
          text: t(tk.alert.formError.dismissText),
          style: 'cancel',
        },
      ]
    );
  };

  return { showDiscardAlert, showFormErrorAlert };
};
