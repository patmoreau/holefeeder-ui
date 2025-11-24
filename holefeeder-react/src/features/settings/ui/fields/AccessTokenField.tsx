import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppField } from '@/features/shared/ui/AppField';
import { AppText } from '@/features/shared/ui/components/AppText';
import { tk } from '@/i18n/translations';
import { TokenInfo } from '@/types/token-info';

export const AccessTokenField = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.profileSection.accessToken)} icon={'key.horizontal'}>
      <AppText numberOfLines={1} ellipsizeMode={'tail'}>
        {tokenInfo.accessToken || t(tk.profileSection.noAccessToken)}
      </AppText>
    </AppField>
  );
};
