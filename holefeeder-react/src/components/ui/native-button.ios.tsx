import {
  Button,
  Host,
  ButtonProps as IOSButtonProps,
  CircularProgress,
  VStack,
  HStack,
  Section,
  Form,
} from '@expo/ui/swift-ui';
import React from 'react';
import { Text } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  style?: any;
} & IOSButtonProps;

// iOS SwiftUI Button Component
export const NativeButton: React.FC<ButtonProps> = ({
  onPress,
  style,
  children,
  ...props
}) => {
  return (
    <>
      <Host style={{ flex: 1 }}>
        <Form>
          {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
          <Section title="🔘 Buttons">
            <VStack spacing={12}>
              <Button variant="default">Default</Button>
              <Button variant="bordered">Bordered</Button>
              <Button variant="plain">Plain</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="glassProminent">Glass Prominent</Button>
              <Button variant="borderedProminent">Bordered Prominent</Button>
              <Button variant="borderless">Borderless</Button>
              <Button variant="glassProminent" onPress={onPress}>
                {children}
              </Button>
            </VStack>
          </Section>
        </Form>
      </Host>
    </>
    // <Host matchContents>
    //   <VStack spacing={16}>
    //     <CircularProgress />
    //   </VStack>
    // </Host>
    // <Text>{children}</Text>
    // {/*<Button variant="glassProminent" onPress={onPress}>*/}
    // {/*  {buttonText}*/}
    // {/*</Button>*/}
    // {/*</View>*/}
  );
};
