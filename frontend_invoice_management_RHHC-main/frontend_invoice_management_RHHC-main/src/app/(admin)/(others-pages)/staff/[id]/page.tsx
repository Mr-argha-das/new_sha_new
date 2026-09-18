'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import { use, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/modules/common/components/page-layout';
import Link from '@/modules/common/elements/link';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import { Button } from '@mui/material';
import { getUserById, getAllStaffExperience } from '../api';
import GeneralInformation from './components/general-info';
import OtherInformation from './components/other-info';
import UserEditPageContext, { UserEditPageSection } from './context';
import { StaffExperience, StaffExperienceDocument } from '@/modules/common/models/staff';
import { User } from '@/modules/common/models/user';

interface UserEditPageParams {
  id: ID;
}

interface UserEditPageProps {
  params: Promise<UserEditPageParams>;
}

const UserEditPage: NextPage<UserEditPageProps> = ({ params }) => {
  const { id } = use(params);
  const [activeSection, setActiveSection] =
    useState<UserEditPageSection | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkListItemAddModal, setCheckListItemAddModal] =
    useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const { token, isAuthLoading, user: loggedUser } = useAuth();
  const queryClient = useQueryClient();
  const [experiences, setExperiences] = useState<StaffExperience[]>([]);

  const {
    data: response,
    isFetching,
  } = useQuery({
    queryKey: ['getUserById', id],
    queryFn: () => getUserById(id).then((response) => response.data),
    enabled: !!id && !!token,
  });

  // Fetch staff experiences here and provide via context
  const {
    isFetching: isFetchingExperiences,
  } = useQuery({
    queryKey: ['getAllStaffExperience', id, loggedUser?.account_id, loggedUser?.branch_id],
    queryFn: async () => {
      const res = await getAllStaffExperience(String(id), {
        account_id: Number(loggedUser?.account_id),
        branch_id: Number(loggedUser?.branch_id),
      });
      const payload = res?.data?.data;
      const rowsArr: unknown =
        Array.isArray(payload) ? payload :
          (payload && Array.isArray((payload as { data?: unknown[] }).data) ? (payload as { data: unknown[] }).data : []);
      const normalized = (rowsArr as StaffExperience[]).map((r) => ({
        ...r,
        documents:
          typeof (r as unknown as { documents?: unknown }).documents === 'string'
            ? ((r as unknown as { documents?: string }).documents
              ? JSON.parse((r as unknown as { documents?: string }).documents as string)
              : [])
            : Array.isArray((r as unknown as { documents?: unknown }).documents)
              ? (r.documents as StaffExperienceDocument[])
              : [],
      })) as StaffExperience[];
      setExperiences(normalized);
      return normalized;
    },
    enabled: !!id && !!token && !!loggedUser?.account_id && !!loggedUser?.branch_id,
  });

  const refetchExperiences = async () => {
    await queryClient.invalidateQueries({ queryKey: ['getAllStaffExperience', id, loggedUser?.account_id, loggedUser?.branch_id] });
  };

  if (isAuthLoading || isFetching) {
    return <PageLoader />;
  }
  type ApiDataWrapper = { data?: unknown };
  type MinimalUser = { name?: string; permanent_address?: unknown; temporary_address?: unknown } & Record<string, unknown>;
  const wrapped = response as unknown as ApiDataWrapper | undefined;
  const rawUserObj = ((wrapped && wrapped.data !== undefined) ? wrapped.data : response) as MinimalUser;

  const parseMaybeJson = <T,>(val: unknown): T | null => {
    if (!val) return null;
    if (typeof val === 'object') return val as T;
    try {
      return JSON.parse(String(val)) as T;
    } catch {
      return null;
    }
  };

  // Normalize user object shape (API may wrap/omit fields)
  const hydratedUser: MinimalUser = {
    ...rawUserObj,
    permanent_address: parseMaybeJson(rawUserObj?.permanent_address),
    temporary_address: parseMaybeJson(rawUserObj?.temporary_address),
  };

  return (
    <>
      <PagePermissionGuard permissions={'user-management/user:write'}>
        <UserEditPageContext.Provider
          value={{
            user: hydratedUser as unknown as User,
            activeSection,
            setActiveSection,
            loading,
            setLoading,
            checkListItemAddModal,
            setCheckListItemAddModal,
            editId,
            setEditId,
            experiences,
            setExperiences,
            experiencesLoading: isFetchingExperiences,
            refetchExperiences,
          }}
        >
          <PageLayout>
            <PageLayout.Header
              isListHeader={false}
              title={capitalizeWords(hydratedUser.name)}
              breadcrumbs={[
                {
                  href: '/staff',
                  name: 'Staff',
                },
                {
                  name: 'Edit',
                },
              ]}
              back={
                <Link href={`/staff`}>
                  <Button type="button" variant="text">
                    Back to List
                  </Button>
                </Link>
              }
            ></PageLayout.Header>

            <PageLayout.Content>
              <GeneralInformation />
              <OtherInformation />
            </PageLayout.Content>
          </PageLayout>
        </UserEditPageContext.Provider>
      </PagePermissionGuard>
    </>
  );
};
export default UserEditPage;
