import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppTextInput } from '@/features/shared/ui/components/AppTextInput';
import { tk } from '@/i18n/translations';
import { AppIcons } from '@/types/icons';

type Props = {
  description: string;
  onDescriptionChange: (description: string) => void;
};

export const DescriptionField = ({ description, onDescriptionChange }: Props) => {
  const { t } = useTranslation();

  return (
    <AppField icon={AppIcons.description}>
      <AppTextInput placeholder={t(tk.purchase.basicSection.description)} value={description} onChangeText={onDescriptionChange} />
    </AppField>
  );
};
