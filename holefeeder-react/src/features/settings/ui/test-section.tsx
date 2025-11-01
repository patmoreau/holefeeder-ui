import { Section, LabeledContent, Button } from '@expo/ui/swift-ui';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Category } from '@/features/purchase/core/category';
import { useCategories } from '@/features/purchase/core/use-categories';
import { CategoryPicker } from '@/features/purchase/ui/components/CategoryPicker';
import { useLanguage } from '@/shared/hooks/use-language';

export function TestSection() {
  const { t } = useLanguage();
  const { data: categories } = useCategories();

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
      <LabeledContent label={t('test-section.component')}>
        <CategoryPicker
          categories={categories || []}
          selectedCategory={selectedCategory || categories?.[0] || null}
          onSelectCategory={setSelectedCategory}
        />
      </LabeledContent>
    </Section>
  );
}
