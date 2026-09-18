import { useInfiniteQuery } from '@tanstack/react-query';

type Fetcher<T, P extends Record<string, unknown>> = (
  params: P & { page: number; limit: number },
) => Promise<{
  data: { data: T[]; meta: { total: number } };
}>;

interface Options<T, P extends Record<string, unknown>> {
  queryKey: (string | number | boolean | null | undefined)[];
  fetcher: Fetcher<T, P>;
  params: P;
  limit?: number;
  enabled?: boolean;
}

export function useHorizontalInfiniteList<T, P extends Record<string, unknown>>(
  opts: Options<T, P>,
) {
  const { queryKey, fetcher, params, limit = 20, enabled = true } = opts;

  const query = useInfiniteQuery({
    queryKey: [...queryKey, params, limit],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetcher({
        ...(params as P),
        page: pageParam as number,
        limit,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, p) => sum + (p?.data?.length || 0),
        0,
      );
      const total = lastPage?.meta?.total ?? 0;
      return loaded < total ? allPages.length + 1 : undefined;
    },
  });

  const flatData = (query.data?.pages || []).flatMap((p) => p?.data || []);

  return {
    ...query,
    items: flatData as T[],
    hasMore: typeof query.hasNextPage === 'boolean' ? query.hasNextPage : true,
  };
}
