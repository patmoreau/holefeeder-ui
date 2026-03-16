import { ScrollView, View, type ViewProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { spacing } from '@/types/theme/design-tokens';
import { UpcomingFlow } from '@/domain/core/flows/upcoming-flow';
import { UpcomingCard } from '@/features/dashboard/ui/components/UpcomingCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type UpcomingCardListProps = ViewProps & {
  upcomingFlows: UpcomingFlow[];
};

const createStyles = () => ({
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});

export const UpcomingCardList = ({ upcomingFlows, style, ...props }: UpcomingCardListProps) => {
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={style} {...props}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom + spacing.lg }]}
        decelerationRate="fast"
        snapToInterval={spacing.lg} // card width + margin
        snapToAlignment="start"
      >
        {upcomingFlows.map((flow) => (
          <UpcomingCard key={flow.id + flow.date} upcomingFlow={flow} />
        ))}
      </ScrollView>
    </View>
  );
};
