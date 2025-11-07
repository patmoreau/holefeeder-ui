import { View, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Tag } from '@/features/purchase/core/tag';
import { useTagList } from '@/features/purchase/core/use-tag-list';
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

  return (
    <View style={styles.container}>
      <TextInput value={filter} onChangeText={setFilter} onSubmitEditing={onSubmit} placeholder={placeholder} style={styles.input} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {filtered.map((tag) => (
          <TagItem
            key={tag.id}
            label={tag.tag}
            selected={selected.some((t) => t.id === tag.id)}
            onPress={() => toggleTag(tag)}
            showIcon={showIcon}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADCE3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
});
