import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UpcomingCard } from '@/dashboard/presentation/components/UpcomingCard';
import { UpcomingFlow } from '@/flows/core/flows/upcoming-flow';
import { tk } from '@/i18n/translations';
import { AppCardDivider } from '@/shared/presentation/components/AppCardDivider';
import { AppCardList } from '@/shared/presentation/components/AppCardList';

export type UpcomingCardListProps = ViewProps & {
  upcomingFlows: UpcomingFlow[];
};

export const UpcomingCardList = ({ upcomingFlows, style, ...props }: UpcomingCardListProps) => {
  const { t } = useTranslation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppCardList style={style} {...props} scrollable="vertical" header={t(tk.upcomingList.title)}>
        {upcomingFlows.map((flow, index) => (
          <View key={flow.id + flow.date}>
            <UpcomingCard upcomingFlow={flow} />
            {index < upcomingFlows.length - 1 && <AppCardDivider />}
          </View>
        ))}
      </AppCardList>
    </GestureHandlerRootView>
  );
};
