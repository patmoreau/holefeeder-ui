import { BottomSheet, Button, HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import { frame, padding } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { AppHost } from '@/features/shared/ui/components/AppHost.ios';
import { tk } from '@/i18n/translations';
import { ErrorKey, tkErrorMessages, tkErrorTitles } from '@/shared/core/error-key';

type Props = {
  showError: boolean;
  setShowError: (isOpened: boolean) => void;
  error: ErrorKey;
  onRetry?: () => void;
};
export const ErrorSheet = ({ showError, setShowError, error, onRetry }: Props) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <AppHost style={{ position: 'absolute', width }}>
      <BottomSheet isOpened={showError} onIsOpenedChange={(e) => setShowError(e)}>
        <VStack spacing={32} modifiers={[frame({ maxWidth: width }), padding({ all: 32 })]}>
          <Text size={18} weight="bold" color="red">
            {t(tkErrorTitles[error])}
          </Text>
          <HStack spacing={16}>
            <Image systemName="exclamationmark.triangle" />
            <Text size={17} modifiers={[frame({ maxWidth: width, height: 100 })]}>
              {t(tkErrorMessages[error])}
            </Text>
          </HStack>
          <HStack spacing={16}>
            {onRetry && (
              <Button variant="borderedProminent" onPress={onRetry}>
                {t(tk.errorSheet.retry)}
              </Button>
            )}
            <Button variant="bordered" onPress={() => setShowError(false)}>
              {t(tk.errorSheet.dismiss)}
            </Button>
          </HStack>
        </VStack>
      </BottomSheet>
    </AppHost>
  );
};
