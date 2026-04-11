import React from 'react';
import { useTranslation } from 'react-i18next';
import { tk } from '@/i18n/translations';
import { AppField } from '@/shared/presentation/AppField';
import { AppText } from '@/shared/presentation/components/AppText';
import { AppIcons } from '@/types/icons';
import { TokenInfo } from '@/types/token-info';

export const AccessTokenField = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.profileSection.accessToken)} icon={AppIcons.token}>
      <AppText numberOfLines={1} ellipsizeMode={'tail'}>
        {tokenInfo.accessToken || t(tk.profileSection.noAccessToken)}
      </AppText>
    </AppField>
  );
};
