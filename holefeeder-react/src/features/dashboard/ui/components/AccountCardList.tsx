import { useState } from 'react';
import { View, type ViewProps } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { AccountCard } from '@/features/dashboard/ui/components/AccountCard';
import { Account } from '@/features/shared/core/account';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { spacing } from '@/types/theme/design-tokens';
import { window } from '@/utils/sizes';

export type AccountCardListProps = ViewProps & {
  accounts: Account[];
};

const createStyles = () => ({
  carouselContainer: {
    paddingVertical: spacing.sm,
  },
});

export const AccountCardList = ({ accounts, style, ...props }: AccountCardListProps) => {
  const styles = useStyles(createStyles);
  const progress = useSharedValue<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  // Add buffer for shadows and any overflow
  const carouselHeight = maxHeight > 0 ? maxHeight + spacing.lg * 2 : undefined;

  return (
    <View style={style} {...props}>
      <Carousel
        loop={true}
        style={[styles.carouselContainer, { width: window.width + spacing.lg, height: carouselHeight }]}
        data={accounts}
        scrollAnimationDuration={300}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.85,
          parallaxScrollingOffset: 95,
        }}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        pagingEnabled={true}
        snapEnabled={true}
        onConfigurePanGesture={(panGesture) => panGesture.activeOffsetX([-10, 10]).failOffsetY([-20, 20])}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              if (height > maxHeight) {
                setMaxHeight(height);
              }
            }}
          />
        )}
      />
    </View>
  );
};
