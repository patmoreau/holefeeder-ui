import { useCallback, useMemo, useState } from 'react';
import { Tag, toTag } from '@/features/purchase/core/tag';

export const useTagList = ({ tags, selected, onChange }: { tags: Tag[]; selected: Tag[]; onChange: (next: Tag[]) => void }) => {
  const [filter, setFilter] = useState('');

  console.log('tags', tags);
  console.log('selected', selected);

  const ordered = useMemo(() => {
    if (!selected?.length) return tags;
    const set = new Set(selected.map((t) => t.id));
    const selectedFirst = [...selected];
    const unselected = tags.filter((t) => !set.has(t.id));
    return [...selectedFirst, ...unselected];
  }, [tags, selected]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter((t) => t.tag.toLowerCase().includes(q));
  }, [ordered, filter]);

  const toggleTag = useCallback(
    (t: Tag) => {
      const exists = selected.includes(t);
      const next = exists ? selected.filter((s) => s !== t) : [...selected, t];
      onChange(next);
      setFilter('');
    },
    [selected, onChange]
  );

  const onSubmit = useCallback(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return;

    const matches = tags.filter((t) => t.tag.toLowerCase().includes(q));

    let nextSelected = selected;
    if (matches.length === 1) {
      const tag = matches[0];
      if (!selected.some((t) => t.id === tag.id)) {
        nextSelected = [tag, ...selected];
      }
    } else {
      const newTag: Tag = toTag({ tag: q, count: 0 });
      if (!selected.some((t) => t.id === newTag.id)) {
        nextSelected = [newTag, ...selected];
      }
    }

    if (nextSelected !== selected) {
      onChange(nextSelected);
    }

    setFilter('');
  }, [filter, tags, selected, onChange]);

  return {
    filter,
    setFilter,
    onSubmit,
    toggleTag,
    filtered,
  };
};
