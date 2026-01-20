import { Tag, TagResponse, toTag } from '@/features/purchase/core/tag';
import { usePowerSyncWatchedQuery } from '@/shared/hooks/use-powersync-watched-query';
import { UseQueryResult } from '@/shared/hooks/use-query-result';

type UseTagsResult = UseQueryResult<Tag[]>;

export const useTags = (): UseTagsResult => {
  return usePowerSyncWatchedQuery<TagResponse, Tag>(
    'purchase-use-tags',
    `
    WITH RECURSIVE split(tag, remainder) AS
                     (SELECT
                             Ltrim(Substr(tags || ',', 1, Instr(tags || ',', ',') - 1)) AS tag,
                             Substr(tags || ',', Instr(tags || ',', ',') + 1)           AS remainder
                      FROM transactions
                      WHERE tags IS NOT NULL AND tags <> ''
                      UNION ALL
                      SELECT
                             Ltrim(Substr(remainder, 1, Instr(remainder, ',') - 1)) AS tag,
                             Substr(remainder, Instr(remainder, ',') + 1)           AS remainder
                      FROM split
                      WHERE remainder <> '')
    SELECT tag,
           COUNT(*) AS count
    FROM split
    WHERE tag <> ''
    GROUP BY tag
    ORDER BY count DESC, tag ASC;
  `,
    [],
    toTag
  );
};
