import { BottomSheet, Button, Host, HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import { frame, padding } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { ErrorKey } from '@/features/shared/core/error-key';
import { useLanguage } from '@/shared/hooks/use-language';

type Props = {
  showError: boolean;
  setShowError: (isOpened: boolean) => void;
  error: ErrorKey;
  onRetry?: () => void;
};
export const ErrorSheet = ({ showError, setShowError, error, onRetry }: Props) => {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();

  return (
    <Host style={{ position: 'absolute', width }}>
      <BottomSheet isOpened={showError} onIsOpenedChange={(e) => setShowError(e)}>
        <VStack spacing={32} modifiers={[frame({ maxWidth: width }), padding({ all: 32 })]}>
          <Text size={18} weight="bold" color="red">
            {t(`errors.${error}.title`)}
          </Text>
          <HStack spacing={16}>
            <Image systemName="exclamationmark.triangle" />
            <Text size={17} modifiers={[frame({ maxWidth: width, height: 100 })]}>
              {t(`errors.${error}.message`)}
            </Text>
          </HStack>
          <HStack spacing={16}>
            {onRetry && (
              <Button variant="borderedProminent" onPress={onRetry}>
                {t('errorSheet.retry')}
              </Button>
            )}
            <Button variant="bordered" onPress={() => setShowError(false)}>
              {t('errorSheet.dismiss')}
            </Button>
          </HStack>
        </VStack>
      </BottomSheet>
    </Host>
  );
};
