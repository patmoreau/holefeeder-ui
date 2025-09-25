import { Section, LabeledContent, Button } from '@expo/ui/swift-ui';
import React from 'react';
import { useLanguage } from '@/hooks';
import { router } from 'expo-router';

export function TestSection() {
  const { t } = useLanguage();

  return (
    <Section title={t('test-section.title')}>
      <LabeledContent label={t('test-section.not-found-page')}>
        <Button
          variant="link"
          onPress={() => {
            // @ts-ignore
            router.push({ pathname: '/+not-found' });
          }}
        >
          {t('test-section.go-to')}
        </Button>
      </LabeledContent>
    </Section>
  );
}
