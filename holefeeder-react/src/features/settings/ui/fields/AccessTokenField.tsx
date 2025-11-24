import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { Field } from '@/features/shared/ui/Field';
import { tk } from '@/i18n/translations';
import { TokenInfo } from '@/types/token-info';

export const AccessTokenField = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  const { t } = useTranslation();

  return (
    <Field label={t(tk.profileSection.accessToken)} icon={'key.horizontal'}>
      <ThemedText numberOfLines={1} ellipsizeMode={'tail'}>
        {tokenInfo.accessToken || t(tk.profileSection.noAccessToken)}
      </ThemedText>
    </Field>
  );
};
