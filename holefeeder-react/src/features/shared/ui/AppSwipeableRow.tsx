import React, { ReactNode, useRef } from 'react';
import { View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { useStyles } from '@/shared/hooks/theme/use-styles';

type AppSwipeableRowProps = {
  renderLeftActions?: (progress: SharedValue<number>, swipeableRef: React.RefObject<SwipeableMethods | null>) => ReactNode;
  renderRightActions?: (progress: SharedValue<number>, swipeableRef: React.RefObject<SwipeableMethods | null>) => ReactNode;
  children?: ReactNode;
};

const createStyles = () => ({
  rightActionsView: {
    width: 192,
    flexDirection: 'row' as const,
  },
});

export const AppSwipeableRow = ({ renderLeftActions, renderRightActions, children }: AppSwipeableRowProps) => {
  const styles = useStyles(createStyles);
  const swipeableRow = useRef<SwipeableMethods>(null);

  const rightActions = (renderRightActions: ReactNode) => <View style={styles.rightActionsView}>{renderRightActions}</View>;

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions ? (_, progress) => renderLeftActions(progress, swipeableRow) : undefined}
      renderRightActions={renderRightActions ? (_, progress) => rightActions(renderRightActions(progress, swipeableRow)) : undefined}
    >
      {children}
    </Swipeable>
  );
};
