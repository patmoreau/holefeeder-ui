import React from 'react';
import { View, Text as RNText, Button as RNButton } from 'react-native';

const Host = ({ children, style }: any) => <View style={style}>{children}</View>;

const BottomSheet = ({ children, isOpened }: any) => (isOpened ? <View testID="bottom-sheet">{children}</View> : null);

const VStack = ({ children }: any) => <View testID="vstack">{children}</View>;

const HStack = ({ children }: any) => (
  <View testID="hstack" style={{ flexDirection: 'row' }}>
    {children}
  </View>
);

const Text = ({ children }: any) => <RNText>{children}</RNText>;

const Button = ({ children, onPress }: any) => <RNButton title={typeof children === 'string' ? children : 'Button'} onPress={onPress} />;

const Image = ({ systemName }: any) => <View testID={`image-${systemName}`} />;

export const SwiftUiBuilder = {
  Host,
  BottomSheet,
  VStack,
  HStack,
  Text,
  Button,
  Image,
};

export default SwiftUiBuilder;
