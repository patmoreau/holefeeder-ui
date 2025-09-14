import { Stack } from 'expo-router';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import type { PropsWithChildren, ReactElement } from 'react';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export const ParallaxScroll = ({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerLeft: () => <Text>Back</Text>,
          headerBackground: () => (
            <Animated.View style={[styles.header, headerAnimatedStyle]} />
          ),
        }}
      />
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.Image
          source={{
            uri: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
        <View style={{ height: 2000, backgroundColor: '#fff' }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Parallax Scroll
          </Text>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
