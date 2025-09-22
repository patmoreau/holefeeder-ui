import { Section, LabeledContent } from '@expo/ui/swift-ui';
import React from 'react';
import { useLanguage } from '@/contexts';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export function LanguageSection() {
  const { t } = useLanguage();

  return (
    <Section title={t('language-section.title')}>
      <LabeledContent label={t('language-section.select')}>
        <LanguageSwitcher />
      </LabeledContent>
    </Section>
  );
}
