import { useState, useMemo } from 'react';
import { View, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Tag } from './Tag';

export type TagListProps = {
  tags: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  showIcon?: boolean;
  disabled?: boolean;
};

export function TagList({ tags, selected, onChange, placeholder = 'Filter tags…', showIcon = true, disabled = false }: TagListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((t) => t.toLowerCase().includes(q));
  }, [tags, query]);

  const toggleTag = React.useCallback(
    (t: string) => {
      if (disabled) return;
      const exists = selected.includes(t);
      const next = exists ? selected.filter((s) => s !== t) : [...selected, t];
      onChange(next);
    },
    [selected, onChange, disabled]
  );
  console.debug(tags, selected, filtered);
  return (
    <View style={styles.container}>
      <TextInput value={query} onChangeText={setQuery} placeholder={placeholder} editable={!disabled} style={styles.input} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {filtered.map((tag) => (
          <Tag key={tag} label={tag} selected={selected.includes(tag)} onPress={() => toggleTag(tag)} showIcon={showIcon} disabled={disabled} />
        ))}
      </ScrollView>
    </View>
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
