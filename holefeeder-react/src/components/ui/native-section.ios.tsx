import { Section } from '@expo/ui/swift-ui';
import { type PropsWithChildren, type ReactElement, useState } from 'react';

type Props = PropsWithChildren<{
  title: string;
}>;

export default function NativeSection({ children, title }: Props) {
  return <Section title={title}>{children}</Section>;
}
