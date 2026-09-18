import type { QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

const useInvalidate = () => {
  const client = useQueryClient();

  return (queryKey?: QueryKey) =>
    client.invalidateQueries({
      queryKey,
    });
};

export default useInvalidate;
