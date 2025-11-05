import { Host, Section, TextField } from '@expo/ui/swift-ui';
import React from 'react';
import { View } from 'react-native';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { TagList } from '@/features/purchase/ui/components/TagList';
import { useLanguage } from '@/shared/hooks/use-language';

export const AdditionalDetailsSection = ({ tags }: { tags: Tag[] }) => {
  const { t } = useLanguage();
  const { formData, updateFormField } = usePurchaseForm();

  const selectedTags = formData?.tags ?? [];
  const updateTags = (next: Tag[]) => updateFormField('tags', next);
  const updateDescription = (value: string) => updateFormField('description', value);

  return (
    <>
      <TagList tags={tags} selected={selectedTags} onChange={updateTags} />
      <TextField placeholder={t('purchase.detailsSection.description')} defaultValue={formData.description} onChangeText={updateDescription} />
      {/*<Section title={t('purchase.detailsSection.title')}></Section>*/}
    </>
  );
};
