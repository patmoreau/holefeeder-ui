export interface TagResponse {
  tag: string;
  count: number;
}

export type Tag = TagResponse & { id: string };

export const toTag = (response: TagResponse): Tag => {
  return {
    ...response,
    id: response.tag,
  };
};
