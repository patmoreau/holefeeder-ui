import { FlashList, FlashListProps } from '@shopify/flash-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, StyleProp, View, ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppText } from '@/shared/presentation/components/AppText';
import { UsePagedWatchResult } from '@/shared/presentation/core/use-paged-watch';
import { spacing } from '@/types/theme/design-tokens';

const AnimatedFlashList = Reanimated.createAnimatedComponent(FlashList) as typeof FlashList;

type ListDataProps<T> =
  | { pagedResult: UsePagedWatchResult<T>; data?: never; onEndReached?: never; onStartReached?: never }
  | {
      data: FlashListProps<T>['data'];
      pagedResult?: never;
      onEndReached?: () => void;
      onStartReached?: () => void;
    };

export type AppCardListProps<T> = ListDataProps<T> & {
  header?: string;
  seeAllLabel?: string;
  style?: StyleProp<ViewStyle>;
  scrollable?: 'none' | 'vertical' | 'horizontal';
  /** Required when scrollable is 'horizontal' */
  cardWidth?: number;
  renderItem: NonNullable<FlashListProps<T>['renderItem']>;
  keyExtractor?: FlashListProps<T>['keyExtractor'];
  ItemSeparatorComponent?: FlashListProps<T>['ItemSeparatorComponent'];
  ListHeaderComponent?: FlashListProps<T>['ListHeaderComponent'];
  ListFooterComponent?: FlashListProps<T>['ListFooterComponent'];
  contentContainerStyle?: StyleProp<ViewStyle>;
  onScroll?: FlashListProps<T>['onScroll'];
  scrollEventThrottle?: number;
  onEndReachedThreshold?: number;
  onStartReachedThreshold?: number;
  refreshControl?: React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean | null;
};

const createStyles = () => ({
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  container: {
    flex: 1,
  },
  verticalScrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});

export const AppCardList = <T,>({
  pagedResult,
  data: directData,
  onEndReached: directOnEndReached,
  onStartReached: directOnStartReached,
  onEndReachedThreshold = 0.5,
  onStartReachedThreshold = 0.5,
  header,
  seeAllLabel,
  scrollable,
  cardWidth = 0,
  style,
  contentContainerStyle,
  onScroll,
  scrollEventThrottle,
  onRefresh,
  refreshing = false,
  refreshControl: providedRefreshControl,
  renderItem,
  keyExtractor,
  ItemSeparatorComponent,
  ListHeaderComponent,
  ListFooterComponent,
}: AppCardListProps<T>) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const isHorizontal = scrollable === 'horizontal';

  const listData = pagedResult ? (pagedResult.data.isSuccess ? pagedResult.data.value : []) : directData;
  const onEndReached = pagedResult ? (pagedResult.hasNextPage ? pagedResult.loadNext : undefined) : directOnEndReached;
  const onStartReached = pagedResult ? (pagedResult.hasPreviousPage ? pagedResult.loadPrevious : undefined) : directOnStartReached;

  const headerComponent = header ? (
    <View style={styles.header}>
      <AppText variant={'defaultSemiBold'}>{header}</AppText>
      {/* TODO: navigate to full transaction list */}
      <AppText variant={'footnote'}>{seeAllLabel ?? t(tk.cardList.viewAll)}</AppText>
    </View>
  ) : null;

  const defaultRefreshControl =
    onRefresh && !providedRefreshControl ? (
      <RefreshControl
        refreshing={refreshing ?? false}
        onRefresh={onRefresh}
        tintColor={theme.colors.text}
        colors={[theme.colors.text]}
        progressBackgroundColor={theme.colors.secondaryBackground}
      />
    ) : undefined;

  const resolvedRefreshControl = providedRefreshControl ?? defaultRefreshControl;

  const sharedProps = {
    data: listData,
    renderItem,
    keyExtractor,
    ItemSeparatorComponent,
    ListHeaderComponent,
    ListFooterComponent,
    onScroll,
    scrollEventThrottle,
    onEndReached,
    onEndReachedThreshold,
    onStartReached,
    onStartReachedThreshold,
  };

  if (isHorizontal) {
    return (
      <View style={style}>
        {headerComponent}
        <AnimatedFlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + spacing.sm}
          snapToAlignment="start"
          contentContainerStyle={[{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }, contentContainerStyle]}
          {...sharedProps}
        />
      </View>
    );
  }

  if (scrollable === 'vertical') {
    return (
      <View style={[styles.container, style]}>
        {headerComponent}
        <AnimatedFlashList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.verticalScrollContent, { paddingBottom: bottom + spacing.lg }, contentContainerStyle]}
          refreshControl={resolvedRefreshControl}
          {...sharedProps}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {headerComponent}
      <AnimatedFlashList
        scrollEnabled={false}
        contentContainerStyle={[{ paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }, contentContainerStyle]}
        {...sharedProps}
      />
    </View>
  );
};
