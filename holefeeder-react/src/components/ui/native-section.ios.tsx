import { Section } from '@expo/ui/swift-ui';
import { type NativeSectionProps } from './native-section.types';

export default function NativeSection({
  children,
  title,
  ...sectionProps
}: NativeSectionProps) {
  return (
    <Section testID="section-title" title={title} {...sectionProps}>
      {children}
    </Section>
  );
}
