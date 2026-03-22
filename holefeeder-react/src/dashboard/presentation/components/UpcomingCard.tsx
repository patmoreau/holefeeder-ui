import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View, type ViewProps } from 'react-native';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { useRepositories } from '@/contexts/RepositoryContext';
import { useUpcomingFlow } from '@/dashboard/presentation/core/use-pay-form';
import { UpcomingFlow } from '@/flows/core/flows/upcoming-flow';
import { tk } from '@/i18n/translations';
import { today } from '@/shared/core/with-date';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useLocaleFormatter } from '@/shared/hooks/use-local-formatter';
import { AppSwipeableRow } from '@/shared/presentation/AppSwipeableRow';
import { AppChip } from '@/shared/presentation/components/AppChip';
import { AppLeftAction } from '@/shared/presentation/components/AppLeftAction';
import { AppRightAction } from '@/shared/presentation/components/AppRightAction';
import { AppText } from '@/shared/presentation/components/AppText';
import { showAlert } from '@/shared/presentation/show-alert';
import { Theme } from '@/types/theme';
import { shadows, spacing } from '@/types/theme/design-tokens';

export type UpcomingCardProps = ViewProps & {
  upcomingFlow: UpcomingFlow;
};

const createStyles = (theme: Theme) => ({
  card: {
    flex: 1,
    flexDirection: 'row' as const,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.base,
  },
  cardAmount: {
    flexShrink: 0,
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
  },
  cardDescription: {
    flex: 1,
    flexDirection: 'column' as const,
  },
  tags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: spacing.xs,
  },
});

export const UpcomingCard = ({ upcomingFlow, style, ...props }: UpcomingCardProps) => {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useLocaleFormatter();
  const styles = useStyles(createStyles);
  const repositories = useRepositories();
  const upcomingFlowUseCase = useUpcomingFlow(repositories);
  const { showDeleteAlert } = showAlert(t);

  const handlePay = () => {
    upcomingFlowUseCase.pay(upcomingFlow);
  };

  const handleClear = () => {
    upcomingFlowUseCase.clear(upcomingFlow);
  };

  const handleDelete = () => {
    showDeleteAlert(upcomingFlow.description, {
      onConfirm: () => {
        upcomingFlowUseCase.delete(upcomingFlow);
      },
      onCancel: () => {},
    });
  };

  const renderLeftAction = (progress: SharedValue<number>, swipeableRef: React.RefObject<SwipeableMethods | null>) => {
    return <AppLeftAction text={t(tk.swipeableActions.pay)} dragX={progress} swipeableRef={swipeableRef} />;
  };

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
          onAction={handleClear}
        />
        <AppRightAction
          text={t(tk.swipeableActions.delete)}
          color="#dd2c00"
          x={64}
          progress={progress}
          totalWidth={192}
          swipeableRef={swipeableRef}
          onAction={handleDelete}
        />
      </>
    );
  };

  return (
    <AppSwipeableRow renderLeftActions={renderLeftAction} renderRightActions={renderRightActions} onSwipeableLeftOpen={handlePay}>
      <Pressable
        onLongPress={() => router.push({ pathname: '/(app)/PayUpcoming', params: { data: JSON.stringify(upcomingFlow) } })}
        delayLongPress={400}
      >
        <View style={[styles.card, style]} {...props}>
          <View style={styles.cardDescription}>
            <AppText variant={'defaultSemiBold'} adjustsFontSizeToFit>
              {upcomingFlow.description}
            </AppText>
            {upcomingFlow.tags.length > 0 && (
              <View style={styles.tags}>
                {upcomingFlow.tags.map((tag) => (
                  <AppChip key={tag} selected={true} label={tag} />
                ))}
              </View>
            )}
          </View>
          <View style={styles.cardAmount}>
            <AppText variant={'default'} adjustsFontSizeToFit>
              {formatCurrency(upcomingFlow.amount)}
            </AppText>
            <AppText variant={'footnote'}>{formatDate(upcomingFlow.date, today())}</AppText>
          </View>
        </View>
      </Pressable>
    </AppSwipeableRow>
  );
};
