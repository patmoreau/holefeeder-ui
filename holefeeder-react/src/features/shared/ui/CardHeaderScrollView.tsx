import { useHeaderHeight } from '@react-navigation/elements';
import type { ReactNode } from 'react';
import { type ViewProps } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset
} from 'react-native-reanimated';
import { AppView } from '@/features/shared/ui/components/AppView';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const HEADER_MAX_HEIGHT = 200;

type Props = ViewProps & {
  largeCard: ReactNode;
  smallCard: ReactNode;
  headerBackgroundColor?: string;
  children: ReactNode;
};

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: 'flex-end' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  largeCardContainer: {
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
  },
  smallCardContainer: {
    position: 'absolute' as const,
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center' as const,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    backgroundColor: theme.colors.background,
    minHeight: '100%',
  },
});

export const CardHeaderScrollView = ({ largeCard, smallCard, headerBackgroundColor = '#007AFF', children, ...otherProps }: Props) => {
  const styles = useStyles(createStyles);

  const HEADER_MIN_HEIGHT = useHeaderHeight();
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.2], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], Extrapolation.CLAMP),
      borderBottomLeftRadius: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.5], [16, 0], Extrapolation.CLAMP),
      borderBottomRightRadius: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.5], [16, 0], Extrapolation.CLAMP),
      paddingHorizontal: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.2], [20, 0], Extrapolation.CLAMP),
    };
  });

  const largeCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 0.7], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.2], [0, -30], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const smallCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE * 1.2], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollOffset.value, [0, HEADER_SCROLL_DISTANCE * 1.2], [20, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <AppView style={styles.container}>
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }, headerAnimatedStyle]}>
        <Animated.View style={[styles.largeCardContainer, largeCardAnimatedStyle]}>{largeCard}</Animated.View>
        <Animated.View style={[styles.smallCardContainer, smallCardAnimatedStyle]}>{smallCard}</Animated.View>
      </Animated.View>

      <Animated.ScrollView ref={scrollRef} style={styles.scrollArea} scrollEventThrottle={8}>
        <AppView style={[styles.content, { paddingTop: HEADER_MAX_HEIGHT }]} {...otherProps}>
          {children}
        </AppView>
      </Animated.ScrollView>
    </AppView>
  );
};
