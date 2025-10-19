import React from 'react';
import { View } from 'react-native';
import { Tag } from './Tag';

export type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {tags.map((tag, index) => (
        <Tag key={index} label={tag} />
      ))}
    </View>
  );
}
