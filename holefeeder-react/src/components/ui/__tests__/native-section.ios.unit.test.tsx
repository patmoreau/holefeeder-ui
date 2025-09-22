/* eslint-disable import/first */
// Mock Expo UI components BEFORE imports
jest.mock('@expo/ui/swift-ui', () => {
  const React = require('react');

  const Form = React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('Form', { ...props, ref, testID: 'ios-form' }, children)
  );
  Form.displayName = 'Form';

  const Host = React.forwardRef(
    ({ children, style, ...props }: any, ref: any) =>
      React.createElement(
        'Host',
        {
          ...props,
          ref,
          testID: 'ios-host',
          style,
        },
        children
      )
  );
  Host.displayName = 'Host';

  return {
    Form,
    Host,
  };
});

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import NativeFormIOS from '../native-form.ios';

describe('NativeForm iOS', () => {
  it('should render Host wrapper with correct styling', () => {
    const { getByTestId } = render(
      <NativeFormIOS>
        <Text>Test Content</Text>
      </NativeFormIOS>
    );

    const hostElement = getByTestId('ios-host');
    expect(hostElement).toBeDefined();
    expect(hostElement.props.style).toEqual({ flex: 1 });
  });

  it('should render Form component inside Host', () => {
    const { getByTestId } = render(
      <NativeFormIOS>
        <Text>Test Content</Text>
      </NativeFormIOS>
    );

    const formElement = getByTestId('ios-form');
    expect(formElement).toBeDefined();
    expect(formElement).toHaveTextContent('Test Content');
  });

  it('should pass children to Form component', () => {
    const testContent = 'iOS Test Content';
    const { getByTestId, getByText } = render(
      <NativeFormIOS>
        <Text>{testContent}</Text>
      </NativeFormIOS>
    );
    expect(getByText(testContent)).toBeTruthy();

    const formElement = getByTestId('ios-form');
    expect(formElement).toHaveTextContent(testContent);
  });
});
