import { useCallback, useMemo, useState } from 'react';
import { Tag } from '@/domain/core/flows/tag';
import { Result } from '@/domain/core/result';

export const useTagList = ({ tags, selected, onChange }: { tags: Tag[]; selected: Tag[]; onChange: (next: Tag[]) => void }) => {
  const [filter, setFilter] = useState('');

  const ordered = useMemo(() => {
    if (!selected?.length) return tags;
    const set = new Set(selected.map((t) => t.tag));
    const selectedFirst = [...selected];
    const unselected = tags.filter((t) => !set.has(t.tag));
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
      if (!selected.some((t) => t.tag === tag.tag)) {
        nextSelected = [tag, ...selected];
      }
    } else {
      const newTag = Tag.create({ tag: q, count: 0 });
      if (Result.isSuccess(newTag) && !selected.some((t) => t.tag === newTag.value.tag)) {
        nextSelected = [newTag.value, ...selected];
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
