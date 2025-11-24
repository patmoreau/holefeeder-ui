import { Host, VStack } from '@expo/ui/swift-ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from '@/features/purchase/core/tag';
import { useTagList } from '@/features/purchase/core/use-tag-list';
import { FilterTextField } from '@/features/purchase/ui/components/fields/FilterTextField';
import { Field } from '@/features/shared/ui/Field';
import { tk } from '@/i18n/translations';
import { HorizontalScrollView } from '@/modules/horizontal-scroll-view';
import { TagItem } from './TagItem';

export type TagListProps = {
  tags: Tag[];
  selected: Tag[];
  onChange: (next: Tag[]) => void;
  showIcon?: boolean;
};

export function TagList({ tags, selected, onChange, showIcon = true }: TagListProps) {
  const { t } = useTranslation();
  const { filter, setFilter, onSubmit, toggleTag, filtered } = useTagList({ tags, selected, onChange });

  return (
    <Field label={t(tk.purchase.basicSection.tags)} icon={'tag'} variant="large">
      <Host matchContents>
        <VStack spacing={8}>
          <HorizontalScrollView style={{ gap: 18 }}>
            {filtered.map((tag) => (
              <TagItem
                key={tag.id}
                label={tag.tag}
                selected={selected.some((t) => t.id === tag.id)}
                onPress={() => toggleTag(tag)}
                showIcon={showIcon}
              />
            ))}
          </HorizontalScrollView>
          <FilterTextField filter={filter} setFilter={setFilter} onSubmit={onSubmit} placeholder={t(tk.tagList.placeHolder)} />
        </VStack>
      </Host>
    </Field>
  );
}
