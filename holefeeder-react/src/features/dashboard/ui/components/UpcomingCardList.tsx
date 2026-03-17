import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { UpcomingCard } from '@/features/dashboard/ui/components/UpcomingCard';
import { AppSwipeableRow } from '@/features/shared/ui/AppSwipeableRow';
import { AppLeftAction } from '@/features/shared/ui/components/AppLeftAction';
import { AppRightAction } from '@/features/shared/ui/components/AppRightAction';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme';
import { spacing } from '@/types/theme/design-tokens';

export type UpcomingCardListProps = ViewProps & {
  upcomingFlows: UpcomingFlow[];
};

const createStyles = (theme: Theme) => ({
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.separator,
  },
});

export const UpcomingCardList = ({ upcomingFlows, style, ...props }: UpcomingCardListProps) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();

  const renderLeftActions = (progress: SharedValue<number>, swipeableRef: React.RefObject<SwipeableMethods | null>) => (
    <AppLeftAction text={t(tk.swipeableActions.pay)} dragX={progress} swipeableRef={swipeableRef} />
  );

  const renderRightActions = (progress: SharedValue<number>, swipeableRef: React.RefObject<SwipeableMethods | null>) => {
    return (
      <>
        <AppRightAction
          text={t(tk.swipeableActions.clear)}
          color="#ffab00"
          x={128}
          progress={progress}
          totalWidth={192}
          swipeableRef={swipeableRef}
        />
        <AppRightAction
          text={t(tk.swipeableActions.delete)}
          color="#dd2c00"
          x={64}
          progress={progress}
          totalWidth={192}
          swipeableRef={swipeableRef}
        />
      </>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={style} {...props}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + spacing.lg }]}
          decelerationRate="fast"
          snapToInterval={spacing.lg} // card width + margin
          snapToAlignment="start"
        >
          {upcomingFlows.map((flow, index) => (
            <AppSwipeableRow key={flow.id + flow.date} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
              <>
                <UpcomingCard upcomingFlow={flow} />
                {index < upcomingFlows.length - 1 && <View style={styles.divider} />}
              </>
            </AppSwipeableRow>
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
