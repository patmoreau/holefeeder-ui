import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { AppField } from '@/features/shared/ui/AppField';
import { tk } from '@/i18n/translations';

type Props = {
  description: string;
  onDescriptionChange: (description: string) => void;
};

export const DescriptionField = ({ description, onDescriptionChange }: Props) => {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.purchase.transferSection.description)} icon={'pencil.and.list.clipboard'}>
      <TextInput
        placeholder={t(tk.purchase.basicSection.description)}
        defaultValue={description}
        onChangeText={onDescriptionChange}
        style={{ flex: 1, width: '100%' }}
      />
    </AppField>
  );
};
