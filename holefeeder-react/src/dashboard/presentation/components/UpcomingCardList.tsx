import React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpcomingCard } from '@/dashboard/presentation/components/UpcomingCard';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
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
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={style} {...props}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + spacing.lg }]}
          decelerationRate="fast"
          snapToInterval={spacing.lg}
          snapToAlignment="start"
        >
          {upcomingFlows.map((flow, index) => {
            return (
              <View key={flow.id + flow.date}>
                <UpcomingCard upcomingFlow={flow} />
                {index < upcomingFlows.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
