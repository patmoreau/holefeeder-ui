import { Stack } from 'expo-router';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollOffset } from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = ViewProps & {
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
};

export function ParallaxScrollView({ headerImage, headerBackgroundColor, ...otherProps }: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerLeft: () => <Text>Back</Text>,
          headerBackground: () => <Animated.View style={[styles.header, headerAnimatedStyle]} />,
        }}
      />

      <Animated.ScrollView ref={scrollRef} style={{ backgroundColor, flex: 1 }} scrollEventThrottle={16}>
        <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor[colorScheme] }, headerAnimatedStyle]}>{headerImage}</Animated.View>
        <ThemedView style={styles.content} {...otherProps}></ThemedView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    minHeight: '100%',
  },
});
