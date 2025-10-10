import { Form, Host } from '@expo/ui/swift-ui';
import React from 'react';

interface FormViewProps {
  children: React.ReactNode;
}

export function FormView({ children }: FormViewProps) {
  return (
    <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
      <Form>{children}</Form>
    </Host>
  );
}
