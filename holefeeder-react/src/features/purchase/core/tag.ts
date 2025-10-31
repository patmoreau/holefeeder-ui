export interface TagResponse {
  tag: string;
  count: number;
}

export type Tag = TagResponse & { id: string };

export const toTag = (response: TagResponse): Tag => ({
  ...response,
  id: response.tag,
});
export class TagWithIdFn {}
