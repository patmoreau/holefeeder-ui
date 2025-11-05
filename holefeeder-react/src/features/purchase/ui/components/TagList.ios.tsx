import { VStack } from '@expo/ui/swift-ui';
import * as React from 'react';
import { Tag } from '@/features/purchase/core/tag';
import { useTagList } from '@/features/purchase/core/use-tag-list';
import { FilterTextField } from '@/features/purchase/ui/components/fields/FilterTextField';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { HorizontalScrollView } from '../../../../../modules/horizontal-scroll-view';
import { TagItem } from './TagItem';

export type TagListProps = {
  tags: Tag[];
  selected: Tag[];
  onChange: (next: Tag[]) => void;
  placeholder?: string;
  showIcon?: boolean;
};

export function TagList({ tags, selected, onChange, placeholder = 'Filter tags…', showIcon = true }: TagListProps) {
  const { filter, setFilter, onSubmit, toggleTag, filtered } = useTagList({ tags, selected, onChange });
  const { theme } = useTheme();

  return (
    <VStack spacing={8}>
      <FilterTextField filter={filter} setFilter={setFilter} onSubmit={onSubmit} placeholder={placeholder} />
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
    </VStack>
  );
}
