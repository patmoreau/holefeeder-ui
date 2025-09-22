import { type PropsWithChildren } from 'react';
import { type SectionProps } from '@expo/ui/swift-ui';

export type NativeSectionProps = PropsWithChildren<{
  title: string;
}> &
  Partial<SectionProps>;
