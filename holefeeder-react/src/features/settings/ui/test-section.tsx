import { Button, LabeledContent, Section } from '@expo/ui/swift-ui';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/features/purchase/core/category';
import { useCategories } from '@/features/purchase/core/use-categories';
import { CategoryField } from '@/features/purchase/ui/components/fields/CategoryField';
import { tk } from '@/i18n/translations';

export function TestSection() {
  const { t } = useTranslation();
  const { data: categories } = useCategories();

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  return (
    <Section title={t(tk.testSection.title)}>
      <LabeledContent label={t(tk.testSection.notFoundPage)}>
        <Button
          variant="link"
          onPress={() => {
            // @ts-ignore
            router.push({ pathname: '/+not-found' });
          }}
        >
          {t(tk.testSection.goTo)}
        </Button>
      </LabeledContent>
      <LabeledContent label={t(tk.testSection.component)}>
        <CategoryField
          categories={categories || []}
          selectedCategory={selectedCategory || categories?.[0] || null}
          onSelectCategory={setSelectedCategory}
        />
      </LabeledContent>
    </Section>
  );
}
