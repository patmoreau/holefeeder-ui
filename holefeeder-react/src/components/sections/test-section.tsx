import { Section, LabeledContent, Button } from '@expo/ui/swift-ui';
import React, { useState } from 'react';
import { useCategories, useLanguage } from '@/hooks';
import { router } from 'expo-router';
import { CategoryPicker } from '@/components/category-picker';
import { Category } from '@/types';

export function TestSection() {
  const { t } = useLanguage();
  const { data: categories } = useCategories();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleSubmit = () => {
    if (!selectedCategory) {
      alert('Please select a category and account');
      return;
    }

    // Submit form with selected values
    console.log({
      categoryId: selectedCategory.id,
    });
  };

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
