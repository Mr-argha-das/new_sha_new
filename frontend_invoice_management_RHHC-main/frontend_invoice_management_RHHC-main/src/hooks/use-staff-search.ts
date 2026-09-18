import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { User } from '@/modules/common/models/user';
import { getUser } from '@/app/(admin)/(others-pages)/staff/api';
import { defaultRoles } from '@/modules/common/constant/messages';
import { useAuth } from '@/context/AuthContext';

interface UseStaffSearchResponse {
  userValues: User[];
  searchUsers: (search: string) => Promise<User[]>;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
}

const useStaffSearch = (
  search = '',
  enabled = true,
): UseStaffSearchResponse => {
  const { user } = useAuth();
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getUser', 'initial'],
    queryFn: async () => {
      const res = await getUser({
        page: 1,
        limit: 20,
        q: search,
        account_id: user?.account_id,
        branch_id: user?.branch_id,
        role_id: String(defaultRoles.customer_role_id),
        isRoleIncluded: false,
      });
      return res.data?.data ?? [];
    },
    refetchOnMount: true,
    enabled,
  });

  const userValues = useMemo(() => data ?? [], [data]);

  const searchUsers = useCallback(async (search: string) => {
    const res = await getUser({
        page: 1,
        limit: 20,
        q: search,
        account_id: user?.account_id,
        branch_id: user?.branch_id,
        role_id: String(defaultRoles.customer_role_id),
        isRoleIncluded: false,
    });
    return res.data?.data ?? [];
  }, [user]);

  return {
    userValues,
    searchUsers,
    isLoading,
    isFetching,
    refetch,
  };
};

export default useStaffSearch;
