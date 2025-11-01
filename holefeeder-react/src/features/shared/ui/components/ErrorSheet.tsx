import React from 'react';
import { Text, View } from 'react-native';
import { ErrorKey } from '@/features/shared/core/error-key';
import { Button } from '@/features/shared/ui/components/Button';
import { useLanguage } from '@/shared/hooks/use-language';

type Props = {
  showError: boolean;
  setShowError: (isOpened: boolean) => void;
  error: ErrorKey;
  onRetry?: () => void;
};

export const ErrorSheet = ({ showError, setShowError, error, onRetry }: Props) => {
  const { t } = useLanguage();

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
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>{t(`errors.${error}.title`)}</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>{t(`errors.${error}.message`)}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
        {onRetry && (
          <Button variant={'primary'} onPress={onRetry}>
            {t('errorSheet.retry')}
          </Button>
        )}
        <Button variant={'secondary'} onPress={() => setShowError(false)}>
          {t('errorSheet.dismiss')}
        </Button>
      </View>
    </View>
  );
};
