import { Form, Host } from '@expo/ui/swift-ui';
import { type PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function NativeForm({ children }: Props) {
  return (
    <Host style={{ flex: 1 }}>
      <Form>{children}</Form>
    </Host>
  );
}
