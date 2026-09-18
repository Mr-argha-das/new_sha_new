'use client';

import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { use, useState } from 'react';

import PageLayout from '@/modules/common/components/page-layout';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { getCategoryById } from '../api';
import GeneralInformation from './components/general-info';
import CategoryEditPageContext, { CategoryEditPageSection, Category } from './context';
import Link from '@/modules/common/elements/link';
import { Button } from '@mui/material';

interface CategoryEditPageParams {
    id: string;
}
interface CategoryEditPageProps {
    params: Promise<CategoryEditPageParams>;
}
const CategoryEditPage: NextPage<CategoryEditPageProps> = ({ params }) => {
    const { id } = use(params);
    const [activeSection, setActiveSection] =
        useState<CategoryEditPageSection | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [checkListItemAddModal, setCheckListItemAddModal] =
        useState<boolean>(false);
    const [editId, setEditId] = useState<string>('');

    const {
        data: response,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ['getCategoryById', id],
        queryFn: () => getCategoryById(id).then((response) => {
            const data = response.data;
            return data;
        }),
        enabled: !!id,
    });

    if (isFetching || isLoading) {
        return <PageLoader />;
    }
    const category = response?.data as Category;
    return (
        <>
            <CategoryEditPageContext.Provider
                value={{
                    category,
                    activeSection,
                    setActiveSection,
                    loading,
                    setLoading,
                    checkListItemAddModal,
                    setCheckListItemAddModal,
                    editId,
                    setEditId,
                }}
            >
                <PageLayout>
                    <PageLayout.Header
                        isListHeader={false}
                        title={capitalizeWords(category?.name || '')}
                        breadcrumbs={[
                            {
                                href: '/staff-experience-category',
                                name: 'Experience Category',
                            },
                            {
                                name: 'View',
                            },
                        ]}
                        back={
                            <Link href={`/staff-experience-category`}>
                                <Button type="button" variant="text">
                                    Back to List
                                </Button>
                            </Link>
                        }
                    ></PageLayout.Header>

                    <PageLayout.Content>
                        <GeneralInformation />
                    </PageLayout.Content>
                </PageLayout>
            </CategoryEditPageContext.Provider>
        </>
    );
};

export default CategoryEditPage;

