import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React from 'react';
import { LanguageSwitcher } from '@/features/settings/ui/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/features/settings/ui/components/ThemeSwitcher';
import { useLanguage } from '@/shared/hooks/use-language';

export function DisplaySection() {
  const { t } = useLanguage();

  return (
    <Section title={t('display-section.title')}>
      <LabeledContent label={t('display-section.language')}>
        <LanguageSwitcher />
      </LabeledContent>
      <LabeledContent label={t('display-section.theme')}>
        <ThemeSwitcher />
      </LabeledContent>
    </Section>
  );
}
