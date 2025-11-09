import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ErrorKey, tkErrorMessages, tkErrorTitles } from '@/features/shared/core/error-key';
import { Button } from '@/features/shared/ui/components/Button';
import { tk } from '@/i18n/translations';

type Props = {
  showError: boolean;
  setShowError: (isOpened: boolean) => void;
  error: ErrorKey;
  onRetry?: () => void;
};

export const ErrorSheet = ({ showError, setShowError, error, onRetry }: Props) => {
  const { t } = useTranslation();

  if (!showError) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>{t(tkErrorTitles[error])}</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>{t(tkErrorMessages[error])}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        {onRetry && (
          <Button variant={'primary'} onPress={onRetry}>
            {t(tk.errorSheet.retry)}
          </Button>
        )}
        <Button variant={'secondary'} onPress={() => setShowError(false)}>
          {t(tk.errorSheet.dismiss)}
        </Button>
      </View>
    </View>
  );
};
