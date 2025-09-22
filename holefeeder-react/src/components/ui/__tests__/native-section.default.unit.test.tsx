/* eslint-disable import/first */
// Mock React Native components
jest.mock('react-native', () => ({
  ScrollView: ({ children, style, ...props }: any) => (
    <div data-testid="android-scrollview" style={style} {...props}>
      {children}
    </div>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import NativeFormAndroid from '../native-form';

describe('NativeForm Android', () => {
  it('should render ScrollView with correct styling', () => {
    const { getByTestId } = render(
      <NativeFormAndroid>
        <div>Test Content</div>
      </NativeFormAndroid>
    );

    const scrollViewElement = getByTestId('android-scrollview');
    expect(scrollViewElement).toBeDefined();
    expect(scrollViewElement.props.style).toEqual({
      flex: 1,
      padding: 0,
    });
  });

  it('should pass children to ScrollView', () => {
    const testContent = 'Android Test Content';
    const { getByText } = render(
      <NativeFormAndroid>
        <span>{testContent}</span>
      </NativeFormAndroid>
    );

    expect(getByText(testContent)).toBeDefined();
  });

  it('should apply the correct container styles', () => {
    const { getByTestId } = render(
      <NativeFormAndroid>
        <div>Content</div>
      </NativeFormAndroid>
    );

    const container = getByTestId('android-scrollview');
    expect(container.props.style).toMatchObject({
      flex: 1,
      padding: 0,
    });
  });
});
