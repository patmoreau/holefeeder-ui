import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Tag } from '@/features/purchase/core/tag';
import { useTagList } from '@/features/purchase/core/use-tag-list';
import { Field } from '@/features/shared/ui/Field';
import { tk } from '@/i18n/translations';
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
      <View style={styles.container}>
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
        <TextInput
          value={filter}
          onChangeText={setFilter}
          onSubmitEditing={onSubmit}
          placeholder={t(tk.tagList.placeHolder)}
          style={styles.input}
        />
      </View>
    </Field>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
