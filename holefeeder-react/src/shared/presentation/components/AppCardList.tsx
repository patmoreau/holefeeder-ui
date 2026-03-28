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
import { spacing } from '@/types/theme/design-tokens';

const AnimatedFlashList = Reanimated.createAnimatedComponent(FlashList) as typeof FlashList;

export type AppCardListProps<T> = {
  header?: string;
  seeAllLabel?: string;
  style?: StyleProp<ViewStyle>;
  scrollable?: 'none' | 'vertical' | 'horizontal';
  /** Required when scrollable is 'horizontal' */
  cardWidth?: number;
} & Omit<FlashListProps<T>, 'horizontal' | 'scrollEnabled' | 'style'>;

const createStyles = () => ({
  verticalScrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  noScrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
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
});

export const AppCardList = <T,>({
  header,
  seeAllLabel,
  scrollable,
  cardWidth = 0,
  style,
  contentContainerStyle,
  onRefresh,
  refreshing = false,
  refreshControl: providedRefreshControl,
  ...flashListProps
}: AppCardListProps<T>) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const isHorizontal = scrollable === 'horizontal';

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
          {...flashListProps}
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
          {...flashListProps}
        />
      </View>
    );
  }

  return (
    <View style={[styles.noScrollContent, style]}>
      {headerComponent}
      <AnimatedFlashList
        scrollEnabled={false}
        contentContainerStyle={[{ paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }, contentContainerStyle]}
        {...flashListProps}
      />
    </View>
  );
};
