import React from 'react';
import { useTranslation } from 'react-i18next';
import { tk } from '@/i18n/translations';
import { AppField } from '@/shared/presentation/AppField';
import { AppText } from '@/shared/presentation/components/AppText';
import { AppIcons } from '@/types/icons';
import { TokenInfo } from '@/types/token-info';

export const ExpiresAtField = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  const { t } = useTranslation();

  return (
    <AppField label={t(tk.profileSection.expiresAt)} icon={AppIcons.expiresAt}>
      <AppText>{tokenInfo.expiresAt ?? t(tk.profileSection.noExpiresAt)}</AppText>
    </AppField>
  );
};
