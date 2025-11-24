import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { Field } from '@/features/shared/ui/Field';
import { tk } from '@/i18n/translations';
import { TokenInfo } from '@/types/token-info';

export const ExpiresAtField = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  const { t } = useTranslation();

  return (
    <Field label={t(tk.profileSection.expiresAt)} icon={'clock.badge.exclamationmark'}>
      <ThemedText>{tokenInfo.expiresAt ?? t(tk.profileSection.noExpiresAt)}</ThemedText>
    </Field>
  );
};
