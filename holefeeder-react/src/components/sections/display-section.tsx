import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React from 'react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { useLanguage } from '@/hooks';

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
