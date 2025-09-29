import { Section, LabeledContent, Button } from '@expo/ui/swift-ui';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks';
import { router } from 'expo-router';
import { CategoryPicker } from '@/components/category-picker';
import { useApi } from '@/hooks/use-api';
import { Category } from '@/types';

export function TestSection() {
  const { t } = useLanguage();
  const { getCategories, isReady, isLoading } = useApi();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setError(null);

    const fetchData = async () => {
      const [categoriesResult] = await Promise.all([getCategories()]);

      if (categoriesResult.isFailure) {
        setError(categoriesResult.error);
      } else {
        setCategories(categoriesResult.value);
      }
    };

    fetchData().then();
  }, [isReady, getCategories]);

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
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </LabeledContent>
    </Section>
  );
}
