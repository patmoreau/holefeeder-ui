import { Section } from '@expo/ui/swift-ui';
import { fixedSize, frame } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { TagList } from '@/features/purchase/ui/components/TagList';
import { useLanguage } from '@/shared/hooks/use-language';

export const AdditionalDetailsSection = () => {
  const { t } = useLanguage();
  const { updateFormField } = usePurchaseForm();

  const updateTags = (next: string[]) => updateFormField('tags', next);

  return (
    <Section modifiers={[frame({ minHeight: 100 }), fixedSize({ horizontal: true })]} title={t('purchase.details-section.title')}>
      <TagList tags={['coffee', 'restaurant']} selected={['restaurant']} onChange={updateTags} />
    </Section>
  );
};
