import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/settings/ui/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/features/settings/ui/components/ThemeSwitcher';
import { tk } from '@/i18n/translations';

export function DisplaySection() {
  const { t } = useTranslation();

  return (
    <Section title={t(tk.displaySection.title)}>
      <LabeledContent label={t(tk.displaySection.language)}>
        <LanguageSwitcher />
      </LabeledContent>
      <LabeledContent label={t(tk.displaySection.theme)}>
        <ThemeSwitcher />
      </LabeledContent>
    </Section>
  );
}
