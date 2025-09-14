import React from 'react';
import { View } from 'react-native';
import { Tag } from './tag';

export type TagListProps = {
  tags: string[];
};

export const TagList: React.FC<TagListProps> = ({ tags }) => {
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
};
