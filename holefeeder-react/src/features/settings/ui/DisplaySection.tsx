import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageField } from '@/features/settings/ui/fields/LanguageField';
import { ThemeField } from '@/features/settings/ui/fields/ThemeField';
import { AppSection } from '@/features/shared/ui/AppSection';
import { tk } from '@/i18n/translations';

export function DisplaySection() {
  const { t } = useTranslation();

  return (
    <AppSection title={t(tk.displaySection.title)}>
      <LanguageField />
      <ThemeField />
    </AppSection>
  );
}
