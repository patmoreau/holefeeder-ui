import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppText } from '@/shared/presentation/components/AppText';
import { spacing } from '@/types/theme/design-tokens';

export type AppCardListProps = ViewProps & { header?: string; seeAllLabel?: string } & (
    | { scrollable?: 'none' | 'vertical' }
    | { scrollable: 'horizontal'; cardWidth: number }
  );

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
});

export const AppCardList = ({ header, seeAllLabel, scrollable, style, children, ...props }: AppCardListProps) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);
  const { bottom } = useSafeAreaInsets();
  const headerComponent = header ? (
    <View style={styles.header}>
      <AppText variant={'defaultSemiBold'}>{header}</AppText>
      {/* TODO: navigate to full transaction list */}
      <AppText variant={'footnote'}>{seeAllLabel ?? t(tk.cardList.viewAll)}</AppText>
    </View>
  ) : (
    <></>
  );

  if (scrollable === 'horizontal') {
    const { cardWidth, ...rest } = props as ViewProps & { scrollable: 'horizontal'; cardWidth: number };
    return (
      <View style={style} {...rest}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
          decelerationRate="fast"
          snapToInterval={cardWidth + spacing.sm}
          snapToAlignment="start"
        >
          {headerComponent}
          {children}
        </ScrollView>
      </View>
    );
  }

  if (scrollable === 'vertical') {
    return (
      <View style={style} {...props}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.verticalScrollContent, { paddingBottom: bottom + spacing.lg }]}
        >
          {headerComponent}
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.noScrollContent, style]} {...props}>
      {headerComponent}
      {children}
    </View>
  );
};
